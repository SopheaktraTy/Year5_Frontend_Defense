const plugin = require("tailwindcss/plugin")

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 60s linear infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        }
      },
      backdropBlur: {
        xs: "2px"
      },
      colors: {
        primary: "#2563eb", // Tailwind blue-600 for consistency
        muted: "#f9fafb"
      }
    }
  },
  plugins: [
    require("tailwind-scrollbar-hide"),

    plugin(function ({ addUtilities }) {
      addUtilities({
        ".translate-z-0": {
          transform: "translateZ(0)"
        }
      })
    })
  ]
}
