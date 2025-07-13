import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppStore } from "../../stores/appStore";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";

interface Personality {
  id: string;
  name: string;
  emoji: string;
  tone: string;
  description: string;
  phoneNumber: string;
  themeColor: string;
}

export function PersonalityApp() {
  const { theme } = useTheme();
  const { addPersonality, removePersonality, getPersonalities } = useAppStore();
  const personalities = getPersonalities().map((app) => ({
    id: app.id,
    name: app.name,
    emoji: app.icon,
    tone: app.description || "AI Assistant",
    description: app.description || "Custom AI personality",
    phoneNumber: app.phoneNumber || "+1-AI-CUSTOM",
    themeColor: "#6366f1",
  }));

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersonality, setNewPersonality] = useState({
    name: "",
    emoji: "🤖",
    tone: "neutral",
    description: "",
    phoneNumber: "",
    themeColor: "#6366f1",
  });

  const handleAddPersonality = () => {
    if (newPersonality.name.trim()) {
      const personalityId = `personality-${Date.now()}`;

      // Add to app store as a usable app
      addPersonality({
        id: personalityId,
        name: newPersonality.name,
        icon: newPersonality.emoji,
        position: {
          x: 100 + Math.random() * 300,
          y: 100 + Math.random() * 200,
        },
        size: { width: 800, height: 600 },
        phoneNumber:
          newPersonality.phoneNumber ||
          `+1-AI-${newPersonality.name.toUpperCase().replace(/\s+/g, "-")}`,
        description: newPersonality.description,
      });

      setNewPersonality({
        name: "",
        emoji: "🤖",
        tone: "neutral",
        description: "",
        phoneNumber: "",
        themeColor: "#6366f1",
      });
      setShowAddForm(false);
    }
  };

  const handleDeletePersonality = (id: string) => {
    // Don't delete default Sam and Nova personalities
    if (id === "sam" || id === "nova") return;
    removePersonality(id);
  };

  return (
    <ResizableWindow appId="personality" title="🎭 Personality Manager">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2
            className={cn(
              "text-xl font-semibold",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            AI Personalities
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className={cn(
              "px-4 py-2 rounded-lg backdrop-blur-md border",
              "text-sm font-medium transition-colors",
              theme === "sam"
                ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink hover:bg-sam-pink/30"
                : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan hover:bg-nova-blue/30",
            )}
          >
            + Add New
          </button>
        </div>

        <div className="grid gap-4">
          {personalities.map((personality) => (
            <div
              key={personality.id}
              className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{personality.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {personality.name}
                    </h3>
                    <p className="text-sm text-white/60">{personality.tone}</p>
                    <p className="text-sm text-white/40 mt-1">
                      {personality.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">📞</span>
                        <span className="text-xs text-white/60">
                          {personality.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: personality.themeColor }}
                        />
                        <span className="text-xs text-white/60">
                          Theme Color
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeletePersonality(personality.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div
            className={cn(
              "p-4 rounded-xl backdrop-blur-xl border",
              theme === "sam"
                ? "bg-sam-black/60 border-sam-pink/40"
                : "bg-gray-900/60 border-nova-blue/40",
            )}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Create New Personality
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Personality name"
                value={newPersonality.name}
                onChange={(e) =>
                  setNewPersonality((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <input
                type="text"
                placeholder="Emoji"
                value={newPersonality.emoji}
                onChange={(e) =>
                  setNewPersonality((prev) => ({
                    ...prev,
                    emoji: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <input
                type="text"
                placeholder="Tone (e.g., Friendly, Professional)"
                value={newPersonality.tone}
                onChange={(e) =>
                  setNewPersonality((prev) => ({
                    ...prev,
                    tone: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <input
                type="text"
                placeholder="Phone Number (e.g., +1-AI-CUSTOM)"
                value={newPersonality.phoneNumber}
                onChange={(e) =>
                  setNewPersonality((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <div className="space-y-2">
                <label className="text-sm text-white/70">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newPersonality.themeColor}
                    onChange={(e) =>
                      setNewPersonality((prev) => ({
                        ...prev,
                        themeColor: e.target.value,
                      }))
                    }
                    className="w-12 h-10 rounded-lg bg-white/10 border border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="#hex color"
                    value={newPersonality.themeColor}
                    onChange={(e) =>
                      setNewPersonality((prev) => ({
                        ...prev,
                        themeColor: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[
                    "#ec4899",
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#06b6d4",
                    "#84cc16",
                    "#f97316",
                    "#6366f1",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setNewPersonality((prev) => ({
                          ...prev,
                          themeColor: color,
                        }))
                      }
                      className="w-8 h-8 rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={newPersonality.description}
                onChange={(e) =>
                  setNewPersonality((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddPersonality}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    theme === "sam"
                      ? "bg-sam-pink text-white hover:bg-sam-pink/80"
                      : "bg-nova-blue text-white hover:bg-nova-blue/80",
                  )}
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResizableWindow>
  );
}
