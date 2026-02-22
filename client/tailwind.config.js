/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020617',      // Deep Obsidian (Darkest)
          navy: '#070e23',    // Secondary Navy
          card: 'rgba(15, 23, 42, 0.6)', // Glassmorphic Card
          blue: '#3b82f6',    // Electric Cobalt (Primary)
          cyan: '#06b6d4',    // Data Stream Cyan
          gold: '#fbbf24',    // Warning/Brand Gold
          red: '#ef4444',     // Critical Alert
          green: '#22c55e',    // Secure Status
        }
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.3)',
        'neon-gold': '0 0 15px rgba(251, 191, 36, 0.3)',
      }
    },
  },
  plugins: [],
}