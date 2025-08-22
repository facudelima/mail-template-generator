const readlineSync = require('readline-sync');

class UserInterface {
    static getClientId() {
        return readlineSync.question('📝 Ingresa el clientId del template: ');
    }

    static getTemplateType() {
        return readlineSync.question('📧 Ingresa el tipo de template: ');
    }

    static getSubject() {
        return readlineSync.question('📋 Ingresa el asunto del email: ');
    }

    static getCountries() {
        const countries = readlineSync.question('🌍 Ingresa los países (separados por coma): ');
        return countries.split(',').map(country => country.trim());
    }

    static showMainMenu() {
        console.log('\n🎯 === SISTEMA DE GESTIÓN DE TEMPLATES ===');
        console.log('1. 📝 Crear/Actualizar Template');
        console.log('2. 📋 Listar Templates');
        console.log('3. 🚪 Salir');
        console.log('=====================================\n');
    }

    static getMenuOption() {
        return readlineSync.question('Selecciona una opción (1-3): ');
    }

    static showExistingTemplate(template) {
        console.log('\n📋 Template existente encontrado:');
        console.log(`   ClientId: ${template.clientId}`);
        console.log(`   Tipo: ${template.type}`);
        console.log(`   Asunto: ${template.subject}`);
        console.log(`   Países: ${template.countries.join(', ')}`);
        console.log(`   Fecha de creación: ${template.createdAt}`);
        if (template.updatedAt) {
            console.log(`   Última actualización: ${template.updatedAt}`);
        }
    }

    static getMissingTemplateInfo() {
        console.log('\n📝 Ingresa la información del nuevo template:');
        const type = this.getTemplateType();
        const subject = this.getSubject();
        const countries = this.getCountries();
        
        return { type, subject, countries };
    }

    static getMissingInfoForExisting() {
        console.log('\n📝 Ingresa la información faltante:');
        const type = this.getTemplateType();
        const subject = this.getSubject();
        const countries = this.getCountries();
        
        return { type, subject, countries };
    }

    static showSuccess(message) {
        console.log(`\n✅ ${message}`);
    }

    static showError(message) {
        console.log(`\n❌ ${message}`);
    }

    static showInfo(message) {
        console.log(`\nℹ️  ${message}`);
    }

    static confirmAction(message) {
        return readlineSync.keyInYNStrict(message);
    }
}

module.exports = UserInterface;
