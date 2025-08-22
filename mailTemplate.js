/**
 * Sistema completo de gestión de templates de email con integración MongoDB
 */

const fs = require('fs');
const path = require('path');

// Configuración de variables de entorno
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'prod' ? '.env.prod' : env === 'cert' ? '.env.cert' : '.env.development';

if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
} else {
    console.warn(`⚠️  Archivo ${envFile} no encontrado. Usando variables de entorno del sistema.`);
}

// Importar módulos
const DatabaseManager = require('./database');
const UserInterface = require('./userInterface');

class MailTemplateConverter {
    /**
     * Convierte HTML en template estructurado
     * @param {string} html - Contenido HTML
     * @returns {Object} Template JSON
     */
    static convertToTemplate(html) {
        if (!html || typeof html !== 'string') {
            throw new Error('HTML content must be a non-empty string');
        }
        
        return {
            template: { html: html.trim() }
        };
    }

    /**
     * Genera HTML final con DOCTYPE
     * @param {Object} template - Template JSON
     * @returns {string} HTML final
     */
    static generateFinalHTML(template) {
        if (!template?.template?.html) {
            throw new Error('Invalid template structure');
        }

        let html = template.template.html;
        
        // Agregar DOCTYPE si no está presente
        if (!html.trim().startsWith('<!DOCTYPE')) {
            html = '<!DOCTYPE html>\n' + html;
        }
        
        return html;
    }

    /**
     * Lee archivo HTML y genera template JSON
     * @param {string} inputPath - Ruta del archivo HTML (opcional)
     * @param {string} outputPath - Ruta del archivo JSON de salida (opcional)
     * @returns {Object|null} Template generado o null si hay error
     */
    static generateTemplateFromFile(inputPath = 'index.html', outputPath = 'mailTemplate.json') {
        try {
            const htmlPath = path.resolve(inputPath);
            const templatePath = path.resolve(outputPath);
            
            // Verificar que el archivo HTML existe
            if (!fs.existsSync(htmlPath)) {
                throw new Error(`HTML file not found: ${htmlPath}`);
            }
            
            // Leer y procesar HTML
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            const template = this.convertToTemplate(htmlContent);
            
            // Escribir template JSON
            fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
            
            // Log de éxito
            this._logSuccess(templatePath, htmlContent.length);
            
            return template;
            
        } catch (error) {
            console.error('❌ Error:', error.message);
            return null;
        }
    }

    /**
     * Log de éxito con información del proceso
     * @private
     */
    static _logSuccess(templatePath, htmlSize) {
        console.log('✅ Template JSON generado exitosamente:');
        console.log(`📁 Archivo: ${templatePath}`);
        console.log(`📊 Tamaño del HTML: ${(htmlSize / 1024).toFixed(2)} KB`);
    }

    /**
     * Procesa HTML para almacenamiento en base de datos
     * @param {string} html - HTML original
     * @returns {string} HTML procesado
     */
    static processHTMLForEmail(html) {
        if (!html) return html;
        
        return html
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }

    /**
     * Desprocesa HTML desde base de datos para uso en email
     * @param {string} processedHTML - HTML procesado
     * @returns {string} HTML original
     */
    static unprocessHTMLFromEmail(processedHTML) {
        if (!processedHTML) return processedHTML;
        
        return processedHTML
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
    }
}

// Funciones de conveniencia para uso directo
const convertHTMLToMailTemplate = MailTemplateConverter.convertToTemplate;
const generateMailHTML = MailTemplateConverter.generateFinalHTML;
const generateTemplateFromFile = MailTemplateConverter.generateTemplateFromFile.bind(MailTemplateConverter);

/**
 * Clase principal para gestionar templates
 */
class TemplateManager {
    constructor() {
        this.dbManager = new DatabaseManager();
    }

    async initialize() {
        console.log('🚀 Inicializando sistema de gestión de templates...\n');
        
        const connected = await this.dbManager.connect();
        if (!connected) {
            UserInterface.showError('No se pudo conectar a la base de datos');
            return false;
        }
        
        return true;
    }

    async cleanup() {
        await this.dbManager.disconnect();
    }

    async manageTemplate() {
        try {
            // Obtener clientId
            const clientId = UserInterface.getClientId();
            if (!clientId.trim()) {
                UserInterface.showError('El clientId es obligatorio');
                return;
            }

            // Buscar template existente
            const existingTemplate = await this.dbManager.findTemplateByClientId(clientId);
            
            if (existingTemplate) {
                UserInterface.showExistingTemplate(existingTemplate);
                
                // Verificar si faltan campos
                const missingFields = [];
                if (!existingTemplate.type) missingFields.push('type');
                if (!existingTemplate.subject) missingFields.push('subject');
                if (!existingTemplate.countries || existingTemplate.countries.length === 0) missingFields.push('countries');
                
                if (missingFields.length > 0) {
                    UserInterface.showInfo(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
                    const missingInfo = UserInterface.getMissingInfoForExisting();
                    
                    // Actualizar campos faltantes
                    if (missingInfo.type) existingTemplate.type = missingInfo.type;
                    if (missingInfo.subject) existingTemplate.subject = missingInfo.subject;
                    if (missingInfo.countries && missingInfo.countries.length > 0) existingTemplate.countries = missingInfo.countries;
                    
                    existingTemplate.updatedAt = new Date().toISOString();
                    
                    const updated = await this.dbManager.updateTemplate(clientId, existingTemplate);
                    if (updated) {
                        UserInterface.showSuccess('Template actualizado correctamente');
                    } else {
                        UserInterface.showError('Error actualizando template');
                    }
                } else {
                    UserInterface.showInfo('Template completo, no se requieren actualizaciones');
                }
            } else {
                // Crear nuevo template
                UserInterface.showInfo('Template no encontrado. Creando nuevo template...');
                
                // Generar HTML desde index.html
                const templateData = MailTemplateConverter.generateTemplateFromFile();
                if (!templateData) {
                    UserInterface.showError('Error generando template desde index.html');
                    return;
                }
                
                // Obtener información del template
                const templateInfo = UserInterface.getMissingTemplateInfo();
                
                // Crear objeto del template
                const newTemplate = {
                    clientId: clientId,
                    type: templateInfo.type,
                    subject: templateInfo.subject,
                    countries: templateInfo.countries,
                    template: templateData.template,
                    createdAt: new Date().toISOString()
                };
                
                // Guardar en base de datos
                const insertedId = await this.dbManager.createTemplate(newTemplate);
                if (insertedId) {
                    UserInterface.showSuccess('Template creado correctamente');
                } else {
                    UserInterface.showError('Error creando template');
                }
            }
            
        } catch (error) {
            UserInterface.showError(`Error: ${error.message}`);
        }
    }

    async listTemplates() {
        try {
            const templates = await this.dbManager.listTemplates();
            
            if (templates.length === 0) {
                UserInterface.showInfo('No hay templates en la base de datos');
                return;
            }
            
            console.log('\n📋 Templates en la base de datos:');
            console.log('=====================================');
            
            templates.forEach((template, index) => {
                console.log(`${index + 1}. ClientId: ${template.clientId}`);
                console.log(`   Tipo: ${template.type || 'N/A'}`);
                console.log(`   Asunto: ${template.subject || 'N/A'}`);
                console.log(`   Países: ${template.countries ? template.countries.join(', ') : 'N/A'}`);
                console.log(`   Creado: ${template.createdAt}`);
                if (template.updatedAt) {
                    console.log(`   Actualizado: ${template.updatedAt}`);
                }
                console.log('---');
            });
            
        } catch (error) {
            UserInterface.showError(`Error listando templates: ${error.message}`);
        }
    }

    async runMainMenu() {
        let running = true;
        
        while (running) {
            UserInterface.showMainMenu();
            const option = UserInterface.getMenuOption();
            
            switch (option) {
                case '1':
                    await this.manageTemplate();
                    break;
                case '2':
                    await this.listTemplates();
                    break;
                case '3':
                    running = false;
                    UserInterface.showInfo('¡Hasta luego!');
                    break;
                default:
                    UserInterface.showError('Opción inválida');
            }
            
            if (running) {
                console.log('\nPresiona Enter para continuar...');
                require('readline-sync').question('');
            }
        }
    }
}

/**
 * Función principal del programa
 */
async function main() {
    const templateManager = new TemplateManager();
    
    try {
        const initialized = await templateManager.initialize();
        if (!initialized) {
            process.exit(1);
        }
        
        await templateManager.runMainMenu();
        
    } catch (error) {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    } finally {
        await templateManager.cleanup();
    }
}

// Exportaciones para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MailTemplateConverter,
        convertHTMLToMailTemplate,
        generateMailHTML,
        generateTemplateFromFile,
        processHTMLForEmail: MailTemplateConverter.processHTMLForEmail,
        unprocessHTMLFromEmail: MailTemplateConverter.unprocessHTMLFromEmail,
        main
    };
}

// Exportaciones para navegador
if (typeof window !== 'undefined') {
    Object.assign(window, {
        MailTemplateConverter,
        convertHTMLToMailTemplate,
        generateMailHTML,
        generateTemplateFromFile
    });
}

// Ejecución directa
if (require.main === module) {
    main();
}
