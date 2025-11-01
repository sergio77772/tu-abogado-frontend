# Guía de Despliegue

## Configuración de GitHub Secrets

Para que el workflow funcione, necesitas configurar los siguientes secrets en GitHub:

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega estos secrets:

### Secrets necesarios:

- **FTP_USERNAME**: Tu usuario de FTP
- **FTP_PASSWORD**: Tu contraseña de FTP
- **FTP_REMOTE_DIR**: Directorio remoto donde se desplegará (ej: `/public_html` o `/www`)

## Cómo funciona

El workflow se ejecuta automáticamente cuando:
- Haces push a la rama `main`

## Proceso de despliegue

1. **Checkout**: Descarga el código del repositorio
2. **Setup Node.js**: Configura Node.js versión 18
3. **Build**: Instala dependencias y construye la aplicación
4. **Deploy**: Sube los archivos de la carpeta `dist/` al servidor FTP

## Notas importantes

- El workflow construye la aplicación con la URL de producción configurada
- Solo se despliegan los archivos de la carpeta `dist/` (resultado del build)
- Los archivos de desarrollo (`.git`, `node_modules`, etc.) se excluyen automáticamente

## Despliegue manual

Si necesitas desplegar manualmente:

```bash
# Construir la aplicación
npm run build

# Los archivos estarán en la carpeta dist/
# Súbelos manualmente al servidor FTP
```

## Variables de entorno en producción

Asegúrate de que el servidor tenga configurado:
- La URL del API apunta a: `http://tuabogadoenlinea.free.nf/apis`
- O configura las variables de entorno en el servidor si usas `.env`

