// next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en', // Idioma por defecto
    locales: ['en', 'es'], // Lista de idiomas soportados
    localeDetection: true, // Detectar automáticamente el idioma del navegador/sistema
  },
  localePath: path.resolve('./public/locales'), // Ruta a tus archivos de traducción
  reloadOnPrerender: process.env.NODE_ENV === 'development', // Recargar en desarrollo
  // Opcional: si quieres que la URL no incluya el idioma por defecto
  // defaultNS: 'common', // Namespace por defecto para las traducciones
  // serializeConfig: false, // Necesario para versiones más recientes de Next.js si usas getStaticProps/getServerSideProps
};