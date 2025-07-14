import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";
import { notificationService } from "../../services/notifications";
import { memorySystem } from "../../services/memorySystem";
import { elevenLabsService } from "../../services/elevenlabs";

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: string;
}

function Toggle({ label, description, checked, onChange, icon }: ToggleProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-white">{label}</h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-all duration-200",
          "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
          checked
            ? theme === "sam"
              ? "bg-sam-pink border-sam-pink focus:ring-sam-pink"
              : "bg-nova-blue border-nova-blue focus:ring-nova-blue"
            : "bg-gray-600 border-gray-500 focus:ring-gray-400",
        )}
      >
        <span
          className={cn(
            "block w-4 h-4 rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

interface DropdownProps {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon: string;
}

function Dropdown({
  label,
  description,
  value,
  options,
  onChange,
  icon,
}: DropdownProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-medium text-white">{label}</h3>
            <p className="text-sm text-white/60">{description}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "px-4 py-2 rounded-lg backdrop-blur-md border",
            "text-sm font-medium transition-colors",
            theme === "sam"
              ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink hover:bg-sam-pink/30"
              : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan hover:bg-nova-blue/30",
          )}
        >
          {options.find((opt) => opt.value === value)?.label || value} ▼
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10">
          <div
            className={cn(
              "rounded-xl backdrop-blur-xl border shadow-lg",
              theme === "sam"
                ? "bg-sam-black/90 border-sam-pink/30"
                : "bg-gray-900/90 border-nova-blue/30",
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors",
                  "hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl",
                  value === option.value
                    ? theme === "sam"
                      ? "text-sam-pink bg-sam-pink/10"
                      : "text-nova-cyan bg-nova-blue/10"
                    : "text-white",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SettingsApp() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: notificationService.isNotificationsEnabled(),
    notificationSounds: notificationService.isSoundEnabled(),
    voiceMode: false,
    autoSave: true,
    darkMode: true,
    language: "en",
    voiceType: "neural",
    customWallpaper: null as string | null,
    animations: true,
    glassmorphism: true,
    glassOpacity: 0.1,
    particleEffects: true,
    iconSize: "normal",
    gridSize: "15x5",
    soundEffects: true,
    hapticFeedback: true,
    lowPowerMode: false,
    analyticsEnabled: false,
    // AI settings
    defaultPersonality: "sam",
    aiResponseSpeed: "normal",
    streamingEnabled: true,
    autoTTS: false,
    voiceInputEnabled: true,
    wakeUpPersonality: "sam",
    ttsVolume: 0.7,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load settings from localStorage and services
    const loadSettings = () => {
      setSettings((prev) => ({
        ...prev,
        notifications: notificationService.isNotificationsEnabled(),
        notificationSounds: notificationService.isSoundEnabled(),
        ttsVolume: elevenLabsService.getVolume(),
      }));
    };

    loadSettings();

    // Apply current glass opacity to CSS
    document.documentElement.style.setProperty(
      "--glass-opacity",
      settings.glassOpacity.toString(),
    );
  }, []);

  useEffect(() => {
    // Apply settings to CSS variables whenever they change
    document.documentElement.style.setProperty(
      "--glass-enabled",
      settings.glassmorphism ? "1" : "0",
    );
    document.documentElement.style.setProperty(
      "--animations-enabled",
      settings.animations ? "1" : "0",
    );
    document.documentElement.style.setProperty(
      "--particles-enabled",
      settings.particleEffects ? "1" : "0",
    );
  }, [settings.glassmorphism, settings.animations, settings.particleEffects]);

  const handleToggle = (key: keyof typeof settings) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: checked }));

    // Apply settings immediately
    if (key === "notifications") {
      notificationService.setEnabled(checked);
    } else if (key === "notificationSounds") {
      notificationService.setSoundEnabled(checked);
    } else if (key === "glassmorphism") {
      document.documentElement.style.setProperty(
        "--glass-enabled",
        checked ? "1" : "0",
      );
    } else if (key === "animations") {
      document.documentElement.style.setProperty(
        "--animations-enabled",
        checked ? "1" : "0",
      );
    }
  };

  const handleClearMemory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all memory? This action cannot be undone.",
      )
    ) {
      memorySystem.clearAllMemory();
      alert("Memory cleared successfully!");
    }
  };

  const handleExportData = async () => {
    try {
      const memoryData = memorySystem.exportMemoryData();
      const blob = new Blob([memoryData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sios-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Export failed: " + error);
    }
  };

  const handleGlassOpacityChange = (opacity: number) => {
    setSettings((prev) => ({ ...prev, glassOpacity: opacity }));
    document.documentElement.style.setProperty(
      "--glass-opacity",
      opacity.toString(),
    );
  };

  const handleTTSVolumeChange = (volume: number) => {
    setSettings((prev) => ({ ...prev, ttsVolume: volume }));
    elevenLabsService.setVolume(volume);
  };

  const handleWallpaperUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSettings((prev) => ({ ...prev, customWallpaper: imageUrl }));
        // Apply the wallpaper immediately
        document.documentElement.style.setProperty(
          "--custom-wallpaper",
          `url(${imageUrl})`,
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomWallpaper = () => {
    setSettings((prev) => ({ ...prev, customWallpaper: null }));
    document.documentElement.style.removeProperty("--custom-wallpaper");
  };

  return (
    <ResizableWindow appId="settings" title="🎛 Settings">
      <div className="p-6 space-y-6">
        {/* Theme Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            Appearance
          </h2>
          <div className="space-y-4">
            <Dropdown
              label="Theme"
              description="Choose your SIOS interface theme"
              value={theme}
              options={[
                { value: "sam", label: "Sam Mode" },
                { value: "nova", label: "Nova Mode" },
              ]}
              onChange={(value) => setTheme(value as "sam" | "nova")}
              icon="🎨"
            />
            <Toggle
              label="Dark Mode"
              description="Enable dark interface mode"
              checked={settings.darkMode}
              onChange={handleToggle("darkMode")}
              icon="🌙"
            />
            <Toggle
              label="Animations"
              description="Enable smooth transitions and animations"
              checked={settings.animations}
              onChange={handleToggle("animations")}
              icon="✨"
            />
            <Toggle
              label="Glassmorphism"
              description="Enable glass-like transparency effects"
              checked={settings.glassmorphism}
              onChange={handleToggle("glassmorphism")}
              icon="🔮"
            />

            {/* Glass Opacity Slider */}
            {settings.glassmorphism && (
              <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💎</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">Glass Opacity</h3>
                    <p className="text-sm text-white/60">
                      Adjust transparency level
                    </p>
                  </div>
                  <span className="text-sm text-white/70">
                    {Math.round(settings.glassOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.01"
                  value={settings.glassOpacity}
                  onChange={(e) =>
                    handleGlassOpacityChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${theme === "sam" ? "#ff6b9d" : "#4ecdc4"} 0%, ${theme === "sam" ? "#ff6b9d" : "#4ecdc4"} ${settings.glassOpacity * 333}%, rgba(255,255,255,0.2) ${settings.glassOpacity * 333}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
              </div>
            )}
            <Toggle
              label="Particle Effects"
              description="Enable floating particle background effects"
              checked={settings.particleEffects}
              onChange={handleToggle("particleEffects")}
              icon="🌌"
            />
            <Dropdown
              label="Icon Size"
              description="Adjust the size of app icons"
              value={settings.iconSize}
              options={[
                { value: "small", label: "Small" },
                { value: "normal", label: "Normal" },
                { value: "large", label: "Large" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, iconSize: value }))
              }
              icon="📱"
            />
            <Dropdown
              label="Grid Layout"
              description="Choose icon grid arrangement"
              value={settings.gridSize}
              options={[
                { value: "10x4", label: "10x4 Compact" },
                { value: "15x5", label: "15x5 Standard" },
                { value: "20x6", label: "20x6 Extended" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, gridSize: value }))
              }
              icon="⚏"
            />

            {/* Custom Wallpaper */}
            <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🖼️</span>
                  <div>
                    <h3 className="font-medium text-white">Custom Wallpaper</h3>
                    <p className="text-sm text-white/60">
                      Upload your own background image
                    </p>
                  </div>
                </div>
              </div>

              {settings.customWallpaper && (
                <div className="mb-3 p-2 rounded-lg bg-white/5 border border-white/10">
                  <img
                    src={settings.customWallpaper}
                    alt="Custom wallpaper preview"
                    className="w-full h-20 object-cover rounded"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "px-4 py-2 rounded-lg backdrop-blur-md border text-sm font-medium transition-colors",
                    theme === "sam"
                      ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink hover:bg-sam-pink/30"
                      : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan hover:bg-nova-blue/30",
                  )}
                >
                  Choose Image
                </button>
                {settings.customWallpaper && (
                  <button
                    onClick={removeCustomWallpaper}
                    className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Communication Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            Communication
          </h2>
          <div className="space-y-4">
            <Toggle
              label="Notifications"
              description="Receive system and app notifications"
              checked={settings.notifications}
              onChange={handleToggle("notifications")}
              icon="🔔"
            />
            <Toggle
              label="Notification Sounds"
              description="Play sounds with notifications"
              checked={settings.notificationSounds}
              onChange={handleToggle("notificationSounds")}
              icon="🔊"
            />
            <Toggle
              label="Voice Mode"
              description="Enable voice responses from AI"
              checked={settings.voiceMode}
              onChange={handleToggle("voiceMode")}
              icon="🗣️"
            />
            <Dropdown
              label="Voice Type"
              description="Select AI voice characteristics"
              value={settings.voiceType}
              options={[
                { value: "neural", label: "Neural Voice" },
                { value: "classic", label: "Classic Voice" },
                { value: "robotic", label: "Robotic Voice" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, voiceType: value }))
              }
              icon="🎵"
            />
            <Dropdown
              label="Language"
              description="Interface and AI response language"
              value={settings.language}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, language: value }))
              }
              icon="🌍"
            />
            <Toggle
              label="Sound Effects"
              description="Enable UI sounds and notification tones"
              checked={settings.soundEffects}
              onChange={handleToggle("soundEffects")}
              icon="🔊"
            />
            <Toggle
              label="Haptic Feedback"
              description="Enable touch vibration feedback"
              checked={settings.hapticFeedback}
              onChange={handleToggle("hapticFeedback")}
              icon="📳"
            />
          </div>
        </section>

        {/* Performance Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            Performance
          </h2>
          <div className="space-y-4">
            <Toggle
              label="Low Power Mode"
              description="Reduce animations and effects to save battery"
              checked={settings.lowPowerMode}
              onChange={handleToggle("lowPowerMode")}
              icon="🔋"
            />
            <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="font-medium text-white">
                      Optimize Performance
                    </h3>
                    <p className="text-sm text-white/60">
                      Clear cache and optimize system performance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Performance optimized! (Placeholder)")}
                  className={cn(
                    "px-4 py-2 rounded-lg backdrop-blur-md border text-sm font-medium transition-colors",
                    theme === "sam"
                      ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink hover:bg-sam-pink/30"
                      : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan hover:bg-nova-blue/30",
                  )}
                >
                  Optimize
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            Privacy & Security
          </h2>
          <div className="space-y-4">
            <Toggle
              label="Analytics"
              description="Share anonymous usage data to improve SIOS"
              checked={settings.analyticsEnabled}
              onChange={handleToggle("analyticsEnabled")}
              icon="📊"
            />
            <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className="font-medium text-white">Export Data</h3>
                    <p className="text-sm text-white/60">
                      Download your personal data and conversations
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  className={cn(
                    "px-4 py-2 rounded-lg backdrop-blur-md border text-sm font-medium transition-colors",
                    theme === "sam"
                      ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink hover:bg-sam-pink/30"
                      : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan hover:bg-nova-blue/30",
                  )}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            AI Assistant
          </h2>
          <div className="space-y-4">
            <Dropdown
              label="Default Personality"
              description="Choose the default AI personality for new chats"
              value={settings.defaultPersonality}
              options={[
                { value: "sam", label: "Sam (Urban & Creative)" },
                { value: "nova", label: "Nova (Professional & Analytical)" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, defaultPersonality: value }))
              }
              icon="🤖"
            />
            <Dropdown
              label="Response Speed"
              description="Control how fast the AI responds"
              value={settings.aiResponseSpeed}
              options={[
                { value: "fast", label: "Fast" },
                { value: "normal", label: "Normal" },
                { value: "detailed", label: "Detailed" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, aiResponseSpeed: value }))
              }
              icon="⚡"
            />
            <Toggle
              label="Streaming Responses"
              description="See AI responses as they're being generated"
              checked={settings.streamingEnabled}
              onChange={handleToggle("streamingEnabled")}
              icon="📝"
            />
            <Toggle
              label="Auto Text-to-Speech"
              description="Automatically speak AI responses"
              checked={settings.autoTTS}
              onChange={handleToggle("autoTTS")}
              icon="🔊"
            />

            {/* TTS Volume Slider */}
            <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔉</span>
                <div className="flex-1">
                  <h3 className="font-medium text-white">TTS Volume</h3>
                  <p className="text-sm text-white/60">
                    Adjust voice volume level
                  </p>
                </div>
                <span className="text-sm text-white/70">
                  {Math.round(settings.ttsVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.ttsVolume}
                onChange={(e) =>
                  handleTTSVolumeChange(parseFloat(e.target.value))
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${settings.ttsVolume * 100}%, rgba(255,255,255,0.2) ${settings.ttsVolume * 100}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>
            <Toggle
              label="Voice Input"
              description="Enable microphone for voice commands"
              checked={settings.voiceInputEnabled}
              onChange={handleToggle("voiceInputEnabled")}
              icon="🎤"
            />
            <Dropdown
              label="Wake-up Personality"
              description="Default personality for alarms and wake-up calls"
              value={settings.wakeUpPersonality}
              options={[
                { value: "sam", label: "Sam (Energetic wake-ups)" },
                { value: "nova", label: "Nova (Professional wake-ups)" },
              ]}
              onChange={(value) =>
                setSettings((prev) => ({ ...prev, wakeUpPersonality: value }))
              }
              icon="⏰"
            />
          </div>
        </section>

        {/* System Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            System
          </h2>
          <div className="space-y-4">
            <Toggle
              label="Auto Save"
              description="Automatically save conversations and data"
              checked={settings.autoSave}
              onChange={handleToggle("autoSave")}
              icon="💾"
            />
            <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧹</span>
                  <div>
                    <h3 className="font-medium text-white">Clear Memory</h3>
                    <p className="text-sm text-white/60">
                      Remove all stored conversations and data
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearMemory}
                  className="px-4 py-2 rounded-lg backdrop-blur-md border border-red-500/40 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2
            className={cn(
              "text-xl font-semibold mb-4",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            About
          </h2>
          <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">SIOS v1.0.0</h3>
              <p className="text-sm text-white/60">
                Sam Intelligence Operating System
              </p>
              <p className="text-xs text-white/40">
                Frontend by Builder.io • Backend by Sam AI
              </p>
            </div>
          </div>
        </section>
      </div>
    </ResizableWindow>
  );
}
