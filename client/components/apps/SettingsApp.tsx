import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";

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
    notifications: true,
    voiceMode: false,
    autoSave: true,
    darkMode: true,
    language: "en",
    voiceType: "neural",
    customWallpaper: null as string | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (key: keyof typeof settings) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: checked }));
  };

  const handleClearMemory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all memory? This action cannot be undone.",
      )
    ) {
      // TODO: Implement actual memory clearing
      alert("Memory cleared! (This is a placeholder)");
    }
  };

  return (
    <ResizableWindow appId="settings" title="🎛 Settings">
      <div className="h-full overflow-y-auto">
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
                <h3 className="text-lg font-semibold text-white">
                  SIOS v1.0.0
                </h3>
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
      </div>
    </ResizableWindow>
  );
}
