import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../lib/utils";

export function BackgroundWallpaper() {
  const { theme } = useTheme();

  if (theme === "sam") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient base with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-sam-black via-purple-900/30 to-pink-900/20" />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-sam-pink/10 to-orange-500/20 animate-pulse"
          style={{ animationDuration: "8s" }}
        />

        {/* Flowing liquid shapes */}
        <div className="absolute inset-0 opacity-60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-sam-pink/30 to-purple-500/20 blur-xl animate-liquid-flow"
              style={{
                width: `${100 + Math.random() * 200}px`,
                height: `${100 + Math.random() * 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Urban graffiti elements */}
        <div className="absolute inset-0 opacity-40">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
          >
            <defs>
              <linearGradient id="samGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#f97316" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
              </linearGradient>
              <filter id="neonGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dynamic brush strokes */}
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={i}
                d={`M${Math.random() * 1000},${Math.random() * 1000} Q${Math.random() * 1000},${Math.random() * 1000} ${Math.random() * 1000},${Math.random() * 1000}`}
                stroke="url(#samGlow)"
                strokeWidth={2 + Math.random() * 4}
                fill="none"
                filter="url(#neonGlow)"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}

            {/* Geometric spray paint effects */}
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 1000}
                cy={Math.random() * 1000}
                r={5 + Math.random() * 20}
                fill="url(#samGlow)"
                opacity={0.2 + Math.random() * 0.3}
                className="animate-ping"
                style={{
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Moving light rays */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-sam-pink/50 to-transparent h-px w-full animate-shimmer"
              style={{
                top: `${20 + i * 30}%`,
                animationDelay: `${i * 2}s`,
                transform: `rotate(${-20 + i * 10}deg)`,
              }}
            />
          ))}
        </div>

        {/* Particle system */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-sam-pink rounded-full animate-float"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
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
