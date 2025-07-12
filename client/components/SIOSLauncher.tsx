import { useTheme } from "../contexts/ThemeContext";
import { BackgroundWallpaper } from "./BackgroundWallpaper";
import { DraggableIconGrid } from "./DraggableIconGrid";
import { AndroidNavigation } from "./AndroidNavigation";
import { cn } from "../lib/utils";

export function SIOSLauncher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={cn(
        "relative w-full h-screen overflow-hidden font-poppins",
        theme === "sam"
          ? "bg-gradient-to-br from-sam-black via-sam-gray/20 to-sam-black"
          : "bg-gradient-to-br from-gray-900 via-blue-900/30 to-black",
      )}
    >
      {/* Dynamic Background */}
      <BackgroundWallpaper />

      {/* Status Bar */}
      <div className="relative z-10 flex justify-between items-center p-4 text-white/80">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          SIOS
        </div>
        <button
          onClick={toggleTheme}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            "backdrop-blur-md border border-white/20",
            "hover:bg-white/10 transition-colors",
            theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
          )}
        >
          {theme === "sam" ? "🎨 SAM" : "🌟 NOVA"}
        </button>
      </div>

      {/* App Grid - Full Screen */}
      <div className="relative z-10 flex-1 pb-24">
        <DraggableIconGrid />
      </div>

      {/* Bottom Navigation - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <AndroidNavigation />
      </div>
    </div>
  );
}
