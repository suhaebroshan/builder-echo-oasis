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

  // Nova theme - Futuristic holographic Android-style
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Multi-layered holographic base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/40 to-purple-900/30" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-nova-blue/15 to-nova-cyan/20 animate-glass-pulse" />

      {/* Floating holographic orbs */}
      <div className="absolute inset-0 opacity-50">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-nova-cyan/40 to-nova-blue/20 blur-lg animate-float"
            style={{
              width: `${80 + Math.random() * 150}px`,
              height: `${80 + Math.random() * 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Advanced holographic grid */}
      <div className="absolute inset-0 opacity-40">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="novaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
            </linearGradient>
            <filter id="hologramGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dynamic grid system */}
          {Array.from({ length: 12 }).map((_, i) => (
            <g
              key={i}
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            >
              <line
                x1={i * 83.33}
                y1="0"
                x2={i * 83.33}
                y2="1000"
                stroke="url(#novaGlow)"
                strokeWidth="1"
                opacity={0.3 + Math.random() * 0.3}
                filter="url(#hologramGlow)"
              />
              <line
                x1="0"
                y1={i * 83.33}
                x2="1000"
                y2={i * 83.33}
                stroke="url(#novaGlow)"
                strokeWidth="1"
                opacity={0.3 + Math.random() * 0.3}
                filter="url(#hologramGlow)"
              />
            </g>
          ))}

          {/* Futuristic geometric elements */}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={`geo-${i}`}>
              <polygon
                points={`${200 + i * 150},${150 + i * 100} ${250 + i * 150},${100 + i * 100} ${300 + i * 150},${150 + i * 100} ${250 + i * 150},${200 + i * 100}`}
                fill="none"
                stroke="url(#novaGlow)"
                strokeWidth="2"
                opacity={0.4 + Math.random() * 0.2}
                className="animate-spin"
                style={{
                  transformOrigin: `${250 + i * 150}px ${150 + i * 100}px`,
                  animationDuration: `${10 + i * 2}s`,
                  animationDirection: i % 2 ? "reverse" : "normal",
                }}
              />
            </g>
          ))}

          {/* Scanning beam effects */}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`scan-${i}`}
              x1="0"
              y1={200 + i * 200}
              x2="1000"
              y2={200 + i * 200}
              stroke="url(#novaGlow)"
              strokeWidth={2 + Math.random() * 2}
              opacity="0.7"
              filter="url(#hologramGlow)"
              className="animate-pulse"
              style={{
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Matrix-style digital rain */}
      <div className="absolute inset-0 opacity-25">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-b from-nova-cyan via-nova-blue to-transparent animate-pulse"
            style={{
              width: "2px",
              height: `${100 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          />
        ))}
      </div>

      {/* Holographic data streams */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-nova-cyan/60 to-transparent h-0.5 w-full animate-shimmer"
            style={{
              top: `${15 + i * 15}%`,
              animationDelay: `${i * 1.5}s`,
              transform: `rotate(${-15 + i * 5}deg)`,
            }}
          />
        ))}
      </div>

      {/* Floating holographic particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-nova-cyan rounded-full animate-float"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
