import { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../lib/utils";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "floating" | "nav" | "panel";
  intensity?: "light" | "medium" | "heavy";
  animated?: boolean;
}

export function LiquidGlass({
  children,
  className,
  variant = "primary",
  intensity = "medium",
  animated = false,
}: LiquidGlassProps) {
  const { theme } = useTheme();

  const getGlassStyles = () => {
    const baseStyles = "relative overflow-hidden";

    const intensityStyles = {
      light: "backdrop-blur-sm bg-white/5",
      medium: "backdrop-blur-md bg-white/10",
      heavy: "backdrop-blur-xl bg-white/15",
    };

    const variantStyles = {
      primary: cn(
        "border border-white/20 shadow-glass",
        theme === "sam"
          ? "bg-gradient-to-br from-sam-pink/10 to-sam-black/40 border-sam-pink/30"
          : "bg-gradient-to-br from-nova-blue/10 to-nova-purple/20 border-nova-cyan/30",
      ),
      secondary: cn(
        "border border-white/15 shadow-lg",
        theme === "sam"
          ? "bg-gradient-to-br from-sam-black/60 to-sam-gray/30 border-sam-pink/20"
          : "bg-gradient-to-br from-gray-900/60 to-blue-900/30 border-nova-blue/20",
      ),
      floating: cn(
        "border border-white/25 shadow-glow-lg",
        theme === "sam"
          ? "bg-gradient-to-br from-sam-pink/15 to-sam-black/50 border-sam-pink/40"
          : "bg-gradient-to-br from-nova-cyan/15 to-nova-blue/30 border-nova-cyan/40",
      ),
      nav: cn(
        "border border-white/20 shadow-glass",
        theme === "sam"
          ? "bg-gradient-to-r from-sam-black/70 to-sam-gray/40 border-sam-pink/25"
          : "bg-gradient-to-r from-gray-900/70 to-blue-900/40 border-nova-blue/25",
      ),
      panel: cn(
        "border border-white/30 shadow-2xl",
        theme === "sam"
          ? "bg-gradient-to-br from-sam-black/80 to-sam-pink/20 border-sam-pink/50"
          : "bg-gradient-to-br from-gray-900/80 to-nova-blue/20 border-nova-cyan/50",
      ),
    };

    const animationStyles = animated
      ? "transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-glow-lg"
      : "transition-all duration-300";

    return cn(
      baseStyles,
      intensityStyles[intensity],
      variantStyles[variant],
      animationStyles,
    );
  };

  return (
    <div className={cn(getGlassStyles(), className)}>
      {/* Liquid glass animated background */}
      {animated && (
        <>
          {/* Flowing liquid effect */}
          <div className="absolute inset-0 opacity-30">
            <div
              className={cn(
                "absolute inset-0 animate-pulse",
                theme === "sam"
                  ? "bg-gradient-to-br from-sam-pink/20 via-transparent to-sam-pink/10"
                  : "bg-gradient-to-br from-nova-cyan/20 via-transparent to-nova-blue/10",
              )}
            />
          </div>

          {/* Floating bubbles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-8 h-8 rounded-full opacity-20 animate-bounce",
                  theme === "sam" ? "bg-sam-pink" : "bg-nova-cyan",
                )}
                style={{
                  left: `${20 + i * 30}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i}s`,
                }}
              />
            ))}
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-40">
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
                "animate-shimmer transform -skew-x-12",
              )}
            />
          </div>
        </>
      )}

      {/* Glass refraction lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className={cn(
            "absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent",
          )}
        />
        <div
          className={cn(
            "absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent",
          )}
        />
        <div
          className={cn(
            "absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent",
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
