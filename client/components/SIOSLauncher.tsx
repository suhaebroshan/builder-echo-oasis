import { useTheme } from "../contexts/ThemeContext";
import { useAppStore, type AppId } from "../stores/appStore";
import { BackgroundWallpaper } from "./BackgroundWallpaper";
import { DraggableIconGrid } from "./DraggableIconGrid";
import { AndroidNavigation } from "./AndroidNavigation";
import { cn } from "../lib/utils";

interface AppIconProps {
  appId: AppId;
  icon: string;
  name: string;
  onOpen: (appId: AppId) => void;
}

function AppIcon({ appId, icon, name, onOpen }: AppIconProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={() => onOpen(appId)}
      className={cn(
        "group relative flex flex-col items-center justify-center",
        "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl transition-all duration-300",
        "backdrop-blur-md border border-white/20",
        "hover:scale-110 hover:shadow-glow active:scale-95",
        theme === "sam"
          ? "bg-sam-black/60 hover:bg-sam-pink/20 hover:border-sam-pink/50"
          : "bg-nova-blue/20 hover:bg-nova-cyan/30 hover:border-nova-cyan/60",
      )}
    >
      <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span
        className={cn(
          "absolute -bottom-6 sm:-bottom-8 text-xs font-medium opacity-0",
          "group-hover:opacity-100 transition-opacity duration-200",
          "text-white drop-shadow-lg text-center max-w-20",
        )}
      >
        {name}
      </span>
    </button>
  );
}

interface BottomNavButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function BottomNavButton({
  icon,
  label,
  onClick,
  active = false,
}: BottomNavButtonProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full",
        "backdrop-blur-md border transition-all duration-300",
        "hover:scale-110 active:scale-95",
        active
          ? theme === "sam"
            ? "bg-sam-pink/30 border-sam-pink/60 shadow-glow"
            : "bg-nova-blue/30 border-nova-blue/60 shadow-glow"
          : "bg-white/10 border-white/20 hover:bg-white/20",
      )}
      aria-label={label}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
    </button>
  );
}

export function SIOSLauncher() {
  const { theme, toggleTheme } = useTheme();
  const { apps, openApp, minimizeAll, getOpenApps } = useAppStore();

  const handleBackButton = () => {
    const openApps = getOpenApps();
    if (openApps.length > 0) {
      minimizeAll();
    }
  };

  const handleHomeButton = () => {
    minimizeAll();
  };

  const handleRecentsButton = () => {
    // TODO: Show recent apps overlay
    console.log("Recents clicked - TODO: implement");
  };

  const backgroundPattern = theme === "sam" ? "bg-graffiti" : "bg-hologram";

  return (
    <div
      className={cn(
        "relative w-full h-screen overflow-hidden font-poppins",
        "flex flex-col",
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

      {/* App Grid */}
      <div className="relative z-10">
        <DraggableIconGrid />
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 flex justify-center items-center p-4 sm:p-6 pb-6 sm:pb-8">
        <div
          className={cn(
            "flex items-center gap-4 sm:gap-6 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl",
            "backdrop-blur-xl border border-white/20",
            theme === "sam" ? "bg-sam-black/40" : "bg-white/10 shadow-glass",
          )}
        >
          <BottomNavButton icon="←" label="Back" onClick={handleBackButton} />
          <BottomNavButton
            icon="⌂"
            label="Home"
            onClick={handleHomeButton}
            active={getOpenApps().length === 0}
          />
          <BottomNavButton
            icon="⧉"
            label="Recents"
            onClick={handleRecentsButton}
          />
        </div>
      </div>
    </div>
  );
}
