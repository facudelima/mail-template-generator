/**
 * Script optimizado para convertir HTML en template de mail
 */

const fs = require('fs');
const path = require('path');

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
}

// Funciones de conveniencia para uso directo
const convertHTMLToMailTemplate = MailTemplateConverter.convertToTemplate;
const generateMailHTML = MailTemplateConverter.generateFinalHTML;
const generateTemplateFromFile = MailTemplateConverter.generateTemplateFromFile.bind(MailTemplateConverter);

/**
 * Función principal del programa
 */
function main() {
    console.log('🚀 Generando template de mail desde index.html...\n');
    
    const template = generateTemplateFromFile();
    
    if (template) {
        console.log('\n✨ Proceso completado exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('• Template JSON generado');
        console.log('• HTML listo para usar');
    } else {
        process.exit(1);
    }
}

// Exportaciones para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MailTemplateConverter,
        convertHTMLToMailTemplate,
        generateMailHTML,
        generateTemplateFromFile,
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
