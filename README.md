# Tu Abogado en Línea - Frontend

Frontend de la plataforma "Tu Abogado en Línea" desarrollado con React y Vite.

## Tecnologías

- React 18
- Vite
- Material UI
- React Router
- Axios

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Build para producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
  ├── components/      # Componentes reutilizables
  ├── pages/          # Páginas principales
  ├── services/       # Servicios API
  ├── context/        # Context API (auth, etc)
  ├── utils/          # Utilidades
  ├── theme/          # Configuración de Material UI
  └── App.jsx         # Componente principal
```

## Variables de entorno

Crear archivo `.env`:

```
VITE_API_URL=http://tuabogadoenlinea.free.nf/apis
```

Para desarrollo local, puedes usar:
```
VITE_API_URL=http://localhost/apis
```
