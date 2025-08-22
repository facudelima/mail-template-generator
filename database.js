const { MongoClient } = require('mongodb');

class DatabaseManager {
    constructor() {
        this.client = null;
        this.db = null;
        this.collection = null;
    }

    async connect() {
        try {
            const uri = process.env.MONGODB_URI;
            const dbName = process.env.DB_NAME;
            const collectionName = process.env.COLLECTION_NAME;

            if (!uri || !dbName || !collectionName) {
                throw new Error('❌ Variables de entorno de base de datos no configuradas');
            }

            this.client = new MongoClient(uri);
            await this.client.connect();
            
            this.db = this.client.db(dbName);
            this.collection = this.db.collection(collectionName);
            
            console.log('✅ Conexión a MongoDB establecida');
            return true;
        } catch (error) {
            console.error('❌ Error conectando a MongoDB:', error.message);
            return false;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('🔌 Conexión a MongoDB cerrada');
        }
    }

    async findTemplateByClientId(clientId) {
        try {
            return await this.collection.findOne({ clientId: clientId });
        } catch (error) {
            console.error('❌ Error buscando template:', error.message);
            return null;
        }
    }

    async createTemplate(templateData) {
        try {
            // Remover _id para que MongoDB lo genere automáticamente
            if (templateData._id) {
                delete templateData._id;
            }
            
            const result = await this.collection.insertOne(templateData);
            return result.insertedId;
        } catch (error) {
            console.error('❌ Error creando template:', error.message);
            return null;
        }
    }

    async updateTemplate(clientId, templateData) {
        try {
            // Remover _id para que MongoDB lo genere automáticamente
            if (templateData._id) {
                delete templateData._id;
            }
            
            const result = await this.collection.updateOne(
                { clientId: clientId },
                { $set: templateData }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error('❌ Error actualizando template:', error.message);
            return false;
        }
    }

    async listTemplates() {
        try {
            return await this.collection.find({}).toArray();
        } catch (error) {
            console.error('❌ Error listando templates:', error.message);
            return [];
        }
    }
}

module.exports = DatabaseManager;
