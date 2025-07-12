import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../lib/utils";

export function BackgroundWallpaper() {
  const { theme } = useTheme();

  if (theme === "sam") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-sam-black via-purple-900/20 to-sam-black" />

        {/* Graffiti-style animated patterns */}
        <div className="absolute inset-0 opacity-40">
          {/* Animated neon lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
          >
            <defs>
              <linearGradient id="samGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dynamic curved lines */}
            <path
              d="M100,200 Q300,100 500,200 T900,200"
              stroke="url(#samGlow)"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
              className="animate-pulse"
            />
            <path
              d="M0,400 Q200,350 400,400 Q600,450 800,400 Q900,375 1000,400"
              stroke="url(#samGlow)"
              strokeWidth="2"
              fill="none"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <path
              d="M50,600 Q250,550 450,600 T850,600"
              stroke="url(#samGlow)"
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />

            {/* Floating geometric shapes */}
            <circle
              cx="150"
              cy="150"
              r="30"
              fill="url(#samGlow)"
              opacity="0.3"
              className="animate-bounce"
              style={{ animationDuration: "3s" }}
            />
            <rect
              x="750"
              y="100"
              width="40"
              height="40"
              fill="url(#samGlow)"
              opacity="0.2"
              className="animate-bounce"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            />
            <polygon
              points="800,700 830,750 770,750"
              fill="url(#samGlow)"
              opacity="0.3"
              className="animate-bounce"
              style={{ animationDuration: "5s", animationDelay: "2s" }}
            />
          </svg>
        </div>

        {/* Particle effect overlay */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-sam-pink rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Nova theme
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Holographic gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/20" />

      {/* Holographic grid pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="novaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="hologramGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i}>
              <line
                x1={i * 100}
                y1="0"
                x2={i * 100}
                y2="1000"
                stroke="url(#novaGlow)"
                strokeWidth="1"
                opacity="0.4"
                filter="url(#hologramGlow)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              <line
                x1="0"
                y1={i * 100}
                x2="1000"
                y2={i * 100}
                stroke="url(#novaGlow)"
                strokeWidth="1"
                opacity="0.4"
                filter="url(#hologramGlow)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            </g>
          ))}

          {/* Floating holographic elements */}
          <circle
            cx="200"
            cy="200"
            r="50"
            fill="none"
            stroke="url(#novaGlow)"
            strokeWidth="2"
            opacity="0.6"
            className="animate-spin"
            style={{ animationDuration: "10s" }}
          />
          <circle
            cx="800"
            cy="300"
            r="30"
            fill="none"
            stroke="url(#novaGlow)"
            strokeWidth="2"
            opacity="0.4"
            className="animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          />
          <rect
            x="600"
            y="700"
            width="60"
            height="60"
            fill="none"
            stroke="url(#novaGlow)"
            strokeWidth="2"
            opacity="0.5"
            className="animate-pulse"
          />

          {/* Scanning lines */}
          <line
            x1="0"
            y1="300"
            x2="1000"
            y2="300"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.8"
            filter="url(#hologramGlow)"
            className="animate-pulse"
            style={{ animationDuration: "2s" }}
          />
          <line
            x1="0"
            y1="600"
            x2="1000"
            y2="600"
            stroke="#3b82f6"
            strokeWidth="1"
            opacity="0.6"
            filter="url(#hologramGlow)"
            className="animate-pulse"
            style={{ animationDuration: "3s", animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Digital rain effect */}
      <div className="absolute inset-0 opacity-15">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-nova-cyan to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${50 + Math.random() * 100}px`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
