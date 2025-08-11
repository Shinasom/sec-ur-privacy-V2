// =======================================================================
// /postcss.config.js
// This file configures PostCSS to use the Tailwind CSS plugin.
// This version is updated for Tailwind CSS v4.
// =======================================================================

module.exports = {
  plugins: {
    // We are now using the new '@tailwindcss/postcss' plugin
    // as required by the latest version of Tailwind CSS.
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
