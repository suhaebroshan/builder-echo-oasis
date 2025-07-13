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
    const baseStyles =
      variant === "panel" ? "relative" : "relative overflow-hidden";

    const intensityStyles = {
      light: "backdrop-blur-[2px] bg-white/3",
      medium: "backdrop-blur-[4px] bg-white/5",
      heavy: "backdrop-blur-[6px] bg-white/8",
    };

    const variantStyles = {
      primary: cn(
        "border border-white/20 shadow-glass",
        "bg-white/5 border-white/25",
      ),
      secondary: cn(
        "border border-white/15 shadow-lg",
        "bg-white/3 border-white/20",
      ),
      floating: cn(
        "border border-white/25 shadow-glow-lg",
        "bg-white/4 border-white/30",
      ),
      nav: cn(
        "border border-white/20 shadow-glass",
        "bg-white/6 border-white/25",
      ),
      panel: cn(
        "border border-white/30 shadow-2xl",
        "bg-white/8 border-white/35",
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
                "bg-gradient-to-br from-white/10 via-transparent to-white/5",
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
                  "bg-white",
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
