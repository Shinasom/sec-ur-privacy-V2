// =======================================================================
// /tailwind.config.mjs
// This file is updated to use the ES Module syntax and your new design.
// Dark mode has been disabled to default to a light theme.
// =======================================================================

/** @type {import('tailwindcss').Config} */
const config = {
  // We have removed the `darkMode` key to default to light theme only.
  
  // Specifies which files Tailwind should scan for classes.
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // This is where we define and extend our design system.
  theme: {
    extend: {
      // Here we define our custom fonts.
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        serif: ['"Playfair Display"', 'serif'], 
      },
      // Here we define our custom color palette based on your mockup.
      colors: {
        'background': '#F5F3ED', // Warm, off-white background
        'primary': '#556B2F',    // Deep, olive green for text and actions
        'accent': '#A3B18A',     // Lighter, sage green for highlights
        'surface': '#FFFFFF',    // Pure white for cards and sidebars
        'dark-accent': '#3A5A40', // A darker green for secondary elements
      }
    },
  },

  // This is where you would add any Tailwind plugins.
  plugins: [],
};

export default config;
