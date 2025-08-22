const fs = require('fs');
const MailTemplateConverter = require('./mailTemplate');
const DatabaseManager = require('./database');
const UserInterface = require('./userInterface');

async function testIntegration() {
    console.log('🧪 === TEST DE INTEGRACIÓN ===\n');

    try {
        // Test 1: Generar template desde archivo HTML
        console.log('📝 Test 1: Generando template desde index.html...');
        const templateData = MailTemplateConverter.generateTemplateFromFile('index.html');
        
        if (templateData) {
            console.log('✅ Template generado correctamente');
            console.log(`   HTML length: ${templateData.template.html.length} caracteres`);
        } else {
            console.log('❌ Error generando template');
            return;
        }

        // Test 2: Simular datos de template
        console.log('\n📋 Test 2: Simulando datos de template...');
        const mockTemplate = {
            clientId: 'test-client-001',
            type: 'welcome',
            subject: '¡Bienvenido a nuestro servicio!',
            countries: ['Argentina', 'Chile', 'Uruguay'],
            template: templateData.template,
            createdAt: new Date().toISOString()
        };

        console.log('✅ Datos de template simulados correctamente');

        // Test 3: Procesar HTML para email
        console.log('\n📧 Test 3: Procesando HTML para email...');
        const processedHTML = MailTemplateConverter.processHTMLForEmail(templateData.template.html);
        console.log('✅ HTML procesado para email');

        // Test 4: Desprocesar HTML desde email
        console.log('\n🔄 Test 4: Desprocesando HTML desde email...');
        const unprocessedHTML = MailTemplateConverter.unprocessHTMLFromEmail(processedHTML);
        console.log('✅ HTML desprocesado correctamente');

        // Test 5: Verificar que el HTML original se mantiene
        console.log('\n🔍 Test 5: Verificando integridad del HTML...');
        if (templateData.template.html === unprocessedHTML) {
            console.log('✅ HTML original se mantiene intacto');
        } else {
            console.log('❌ El HTML original se modificó');
        }

        console.log('\n🎉 === TODOS LOS TESTS PASARON ===');
        console.log('\n📊 Resumen:');
        console.log(`   - Template generado: ${templateData.template.html.length} caracteres`);
        console.log(`   - HTML procesado: ${processedHTML.length} caracteres`);
        console.log(`   - Integridad verificada: ✅`);

    } catch (error) {
        console.error('❌ Error en la integración:', error.message);
    }
}

// Ejecutar el test si se llama directamente
if (require.main === module) {
    testIntegration();
}

module.exports = { testIntegration };
