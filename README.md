# Template de Mail

Este proyecto es una **herramienta de trabajo** que desarrollé para simplificar y automatizar una tarea recurrente en mi trabajo en **Toolbox**. Convierte el archivo `index.html` en un template de mail y lo devuelve en formato JSON, facilitando la generación y gestión de plantillas de correo electrónico.

## 🎯 Propósito

Este script fue creado para optimizar el flujo de trabajo diario en Toolbox, eliminando la necesidad de manipular manualmente archivos HTML para crear templates de email. Automatiza el proceso de conversión y genera archivos JSON listos para usar en aplicaciones de envío de correos.

## 📁 Archivos Generados

- `mailTemplate.json` - Template JSON con el HTML completo
- `mailTemplate.js` - Script principal para convertir HTML a template y generar el JSON

## 🚀 Uso del Template

### 1. Cargar el Template

```javascript
const template = require("./mailTemplate.json");
const { generateMailHTML } = require("./script.js");
```

### 2. Generar el HTML Final

```javascript
const finalHTML = generateMailHTML(template);
console.log(finalHTML);
```

## 📋 Ejemplo Completo

```javascript
const template = require("./mailTemplate.json");
const { generateMailHTML } = require("./script.js");

// Generar HTML listo para usar
const htmlContent = generateMailHTML(template);

// Enviar el email
sendEmail({
    to: "usuario@email.com",
    subject: "¡Bienvenido!",
    html: htmlContent
});
```

## 🔄 Regenerar el Template

Si modificas el archivo `index.html`, puedes regenerar el template ejecutando:

```bash
node mailTemplate.js
```

## 📊 Estructura del Template JSON

```json
{
  "template": {
    "html": "..."           // HTML completo del template
  }
}
```

## 🛠️ Funciones Disponibles

### `convertHTMLToMailTemplate(htmlContent)`
Convierte HTML a template JSON.

### `generateMailHTML(template)`
Genera HTML final listo para usar.

## 📧 Características del Template

- ✅ **Responsive** - Se adapta a diferentes dispositivos
- ✅ **Compatible con clientes de email** - Optimizado para Outlook, Gmail, etc.
- ✅ **HTML completo** - Listo para usar directamente
- ✅ **Estándar HTML5** - Incluye declaración DOCTYPE automáticamente
- ✅ **Documentación completa** - Instrucciones de uso incluidas

## 📝 Notas

- El template mantiene todos los estilos CSS inline para compatibilidad
- Las imágenes están referenciadas desde URLs externas
- El HTML está optimizado para clientes de email
- Se incluyen comentarios condicionales para Outlook
- Se agrega automáticamente la declaración `<!DOCTYPE html>` si no está presente

## 🤝 Contribución

Para contribuir al proyecto:

1. Modifica el archivo `index.html` según tus necesidades
2. Ejecuta el script de generación
3. El HTML estará listo para usar
4. Documenta cualquier nueva funcionalidad
