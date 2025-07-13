import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // SIOS Sam Theme Colors
        sam: {
          pink: "hsl(var(--sam-pink))",
          black: "hsl(var(--sam-black))",
          gray: "hsl(var(--sam-gray))",
          accent: "hsl(var(--sam-accent))",
        },
        // SIOS Nova Theme Colors
        nova: {
          blue: "hsl(var(--nova-blue))",
          purple: "hsl(var(--nova-purple))",
          cyan: "hsl(var(--nova-cyan))",
          accent: "hsl(var(--nova-accent))",
        },
        // SIOS System Colors
        sios: {
          panel: "hsl(var(--sios-panel))",
          glass: "hsl(var(--sios-glass))",
          border: "hsl(var(--sios-border))",
          glow: "hsl(var(--sios-glow))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      perspective: {
        "500": "500px",
        "1000": "1000px",
        "1500": "1500px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(var(--glow-color), 0.5)",
        "glow-lg": "0 0 40px rgba(var(--glow-color), 0.4)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "liquid-flow": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "0.3" },
          "50%": { transform: "scale(1.1) rotate(180deg)", opacity: "0.6" },
        },
        "glass-pulse": {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rotate-3d": {
          "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "25%": { transform: "rotateX(5deg) rotateY(5deg)" },
          "50%": { transform: "rotateX(0deg) rotateY(10deg)" },
          "75%": { transform: "rotateX(-5deg) rotateY(5deg)" },
          "100%": { transform: "rotateX(0deg) rotateY(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        "liquid-flow": "liquid-flow 4s ease-in-out infinite",
        "glass-pulse": "glass-pulse 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "rotate-3d": "rotate-3d 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
