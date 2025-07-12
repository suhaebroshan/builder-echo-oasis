import { useTheme } from "../contexts/ThemeContext";
import { useAppStore, type AppId } from "../stores/appStore";
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
        "w-20 h-20 rounded-2xl transition-all duration-300",
        "backdrop-blur-md border border-white/20",
        "hover:scale-110 hover:shadow-glow active:scale-95",
        theme === "sam"
          ? "bg-sam-black/60 hover:bg-sam-pink/20 hover:border-sam-pink/50"
          : "bg-nova-blue/20 hover:bg-nova-cyan/30 hover:border-nova-cyan/60",
      )}
    >
      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span
        className={cn(
          "absolute -bottom-8 text-xs font-medium opacity-0",
          "group-hover:opacity-100 transition-opacity duration-200",
          "text-white drop-shadow-lg",
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
        "flex items-center justify-center w-14 h-14 rounded-full",
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
      <span className="text-xl">{icon}</span>
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
      <div className="absolute inset-0 opacity-30">
        {theme === "sam" ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='graffiti' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M10 10L20 20M30 5L40 15M60 25L70 35M15 40L25 50M50 50L60 60M80 10L90 20M5 70L15 80M40 75L50 85M70 65L80 75' stroke='%23ec4899' stroke-width='2' opacity='0.6'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23graffiti)'/%3E%3C/svg%3E")`,
            }}
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hologram' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0L100 100M0 100L100 0M50 0L50 100M0 50L100 50' stroke='%233b82f6' stroke-width='1' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23hologram)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

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
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-md">
          {Object.values(apps).map((app, index) => (
            <div
              key={app.id}
              className="animate-in slide-in-from-bottom-8 fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <AppIcon
                appId={app.id}
                icon={app.icon}
                name={app.name}
                onOpen={openApp}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 flex justify-center items-center p-6 pb-8">
        <div
          className={cn(
            "flex items-center gap-6 px-8 py-4 rounded-3xl",
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
