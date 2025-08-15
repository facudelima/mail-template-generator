# Mail Template Generator

Este proyecto es una **herramienta de trabajo** que desarrollé para simplificar y automatizar una tarea recurrente en mi trabajo en **Toolbox**. Convierte archivos HTML en templates JSON para almacenar en base de datos y genera HTML final con estructura correcta para el envío de emails.

## 🎯 Propósito

Este script resuelve dos necesidades principales en el flujo de trabajo de emails:

1. **Almacenamiento en Base de Datos**: Convierte templates HTML a formato JSON para guardarlos eficientemente en la base de datos
2. **Generación de HTML Final**: Recupera el template JSON y genera HTML con estructura correcta (DOCTYPE, etc.) listo para envío

## 📁 Archivos del Proyecto

- `mailTemplate.js` - Script principal para conversión HTML ↔ JSON
- `mailTemplate.json` - Template JSON generado (se crea automáticamente)
- `index.html` - Archivo HTML de entrada (debes crearlo)

## 🚀 Uso del Sistema

### 1. Generar Template JSON (para guardar en BD)

```javascript
const { generateTemplateFromFile } = require('./mailTemplate.js');

// Convierte index.html a JSON para almacenar en base de datos
const template = generateTemplateFromFile('index.html', 'mailTemplate.json');
console.log(template);
// Output: { template: { html: "<!DOCTYPE html>..." } }
```

### 2. Generar HTML Final (para envío de email)

```javascript
const { generateMailHTML } = require('./mailTemplate.js');

// Recuperar template desde la base de datos
const templateFromDB = {
    template: { html: "<!DOCTYPE html><html>..." }
};

// Generar HTML final listo para envío
const finalHTML = generateMailHTML(templateFromDB);
console.log(finalHTML);
```

## 📋 Ejemplo Completo de Flujo de Trabajo

```javascript
const { generateTemplateFromFile, generateMailHTML } = require('./mailTemplate.js');

// PASO 1: Crear template JSON para guardar en BD
const template = generateTemplateFromFile('index.html', 'mailTemplate.json');

// PASO 2: Guardar en base de datos (ejemplo)
// await db.templates.save(template);

// PASO 3: Recuperar de BD y generar HTML para envío
const templateFromDB = await db.templates.findById('template-id');
const emailHTML = generateMailHTML(templateFromDB);

// PASO 4: Enviar email
sendEmail({
    to: "usuario@email.com",
    subject: "¡Bienvenido a Toolbox!",
    html: emailHTML
});
```

## 🔄 Regenerar el Template

Si modificas el archivo `index.html`, regenera el template JSON:

```bash
node mailTemplate.js
```

## 📊 Estructura del Template JSON

```json
{
  "template": {
    "html": "<!DOCTYPE html><html><head>...</head><body>...</body></html>"
  }
}
```

## 🛠️ Funciones Disponibles

### `generateTemplateFromFile(inputPath, outputPath)`
Convierte archivo HTML a template JSON para almacenar en BD.

### `generateMailHTML(template)`
Genera HTML final con estructura correcta para envío de emails.

### `convertHTMLToMailTemplate(htmlContent)`
Convierte string HTML a objeto template JSON.

## 📧 Características del Sistema

- ✅ **Almacenamiento Optimizado** - Templates JSON compactos para BD
- ✅ **HTML Estructurado** - Genera HTML con DOCTYPE y estructura correcta
- ✅ **Compatibilidad** - Funciona con cualquier cliente de email
- ✅ **Flexibilidad** - Permite personalización de templates
- ✅ **Automatización** - Elimina trabajo manual de conversión

## 📝 Casos de Uso

### Para Desarrolladores
- Crear templates HTML una vez
- Convertir automáticamente a JSON para BD
- Generar HTML final al momento del envío

### Para el Sistema
- Almacenar templates eficientemente en BD
- Recuperar y personalizar templates dinámicamente
- Enviar emails con estructura HTML correcta

## 🤝 Contribución

Para contribuir al proyecto:

1. Modifica el archivo `index.html` según tus necesidades
2. Ejecuta el script de generación
3. El template JSON estará listo para guardar en BD
4. Documenta cualquier nueva funcionalidad

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/facudelima/mail-template-generator.git

# Navegar al directorio
cd mail-template-generator

# Crear tu archivo index.html
# Ejecutar el generador
node mailTemplate.js
```
