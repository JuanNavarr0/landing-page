// next.config.js
// Importamos la configuración de i18n desde el otro archivo
const i18nConfig = require('./next-i18next.config.js').i18n;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Restauramos la sección i18n, pero solo con lo básico para Next.js
  i18n: {
    locales: i18nConfig.locales, // ['en', 'es']
    defaultLocale: i18nConfig.defaultLocale, // 'en'
    // Importante: Mantenemos localeDetection en false aquí para evitar la advertencia
    // next-i18next se encargará de la detección real.
    localeDetection: false,
  },
};

module.exports = nextConfig;