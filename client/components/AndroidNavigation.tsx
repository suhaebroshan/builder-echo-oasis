import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAppStore } from "../stores/appStore";
import { LiquidGlass } from "./LiquidGlass";
import { cn } from "../lib/utils";

interface NavigationButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function NavigationButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
}: NavigationButtonProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full relative overflow-hidden",
        "backdrop-blur-xl border transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "bg-white/8 hover:bg-white/15 border-white/25 hover:border-white/40",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:opacity-40",
        "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-transparent after:via-white/8 after:to-white/15 after:opacity-60",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:scale-110",
        active &&
          "bg-white/20 border-white/50 shadow-[0_12px_48px_rgba(0,0,0,0.4)] scale-105",
      )}
      aria-label={label}
    >
      <span className="text-lg sm:text-xl relative z-10 text-white">
        {icon}
      </span>
    </button>
  );
}

interface RecentsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

function RecentsOverlay({ isVisible, onClose }: RecentsOverlayProps) {
  const { theme } = useTheme();
  const { apps, openApp, restoreApp, getOpenApps, getMinimizedApps } =
    useAppStore();
  const openApps = getOpenApps();
  const minimizedApps = getMinimizedApps();
  const allRecentApps = [...openApps, ...minimizedApps];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Recents Panel */}
      <div
        className={cn(
          "relative w-[90vw] max-w-4xl h-[70vh] rounded-3xl",
          "backdrop-blur-xl border shadow-glass p-6",
          theme === "sam"
            ? "bg-sam-black/80 border-sam-pink/30"
            : "bg-nova-blue/20 border-nova-cyan/30",
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={cn(
              "text-2xl font-semibold",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            Recent Apps
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-400 hover:bg-red-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {openApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <span className="text-6xl mb-4 opacity-50">📱</span>
            <p className="text-white/60 text-lg">No recent apps</p>
            <p className="text-white/40 text-sm">
              Open some apps to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {openApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  openApp(app.id);
                  onClose();
                }}
                className={cn(
                  "group flex flex-col items-center p-6 rounded-2xl",
                  "backdrop-blur-md border transition-all duration-300",
                  "hover:scale-105 hover:shadow-glow",
                  theme === "sam"
                    ? "bg-sam-black/40 border-sam-pink/30 hover:border-sam-pink/60"
                    : "bg-nova-blue/20 border-nova-cyan/30 hover:border-nova-cyan/60",
                )}
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {app.icon}
                </span>
                <span className="text-white font-medium">{app.name}</span>
                <span className="text-white/60 text-xs mt-1">Active</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AndroidNavigation() {
  const { theme } = useTheme();
  const { getOpenApps, minimizeAll } = useAppStore();
  const [showRecents, setShowRecents] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const openApps = getOpenApps();
  const hasOpenApps = openApps.length > 0;

  // Track navigation history
  useEffect(() => {
    const currentState = hasOpenApps ? "apps" : "home";
    setHistory((prev) => {
      const newHistory = [...prev, currentState];
      return newHistory.slice(-10); // Keep last 10 states
    });
  }, [hasOpenApps]);

  const handleBackButton = () => {
    if (showRecents) {
      setShowRecents(false);
      return;
    }

    if (hasOpenApps) {
      // Android-style back: minimize all open apps
      minimizeAll();
    } else {
      // Could implement app exit or previous screen logic here
      console.log("Back pressed on home screen");
    }
  };

  const handleHomeButton = () => {
    if (showRecents) {
      setShowRecents(false);
    }
    minimizeAll();
  };

  const handleRecentsButton = () => {
    setShowRecents(true);
  };

  return (
    <>
      <div className="flex justify-center items-center p-4 pb-8">
        <div
          className={cn(
            "flex items-center gap-4 sm:gap-6 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl relative overflow-hidden",
            "backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "bg-white/10",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:opacity-50",
            "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-transparent after:via-white/8 after:to-white/15 after:opacity-70",
          )}
        >
          <NavigationButton
            icon="←"
            label="Back"
            onClick={handleBackButton}
            active={false}
          />
          <NavigationButton
            icon="⌂"
            label="Home"
            onClick={handleHomeButton}
            active={!hasOpenApps && !showRecents}
          />
          <NavigationButton
            icon="⧉"
            label="Recents"
            onClick={handleRecentsButton}
            active={showRecents}
          />
        </div>
      </div>

      {/* Recents Overlay */}
      <RecentsOverlay
        isVisible={showRecents}
        onClose={() => setShowRecents(false)}
      />
    </>
  );
}
