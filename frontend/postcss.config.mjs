// =======================================================================
// /postcss.config.mjs
// This is the corrected configuration for Tailwind CSS v4.
// =======================================================================

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // This is the correct plugin name for Tailwind CSS v4
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
