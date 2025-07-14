import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";
import { memorySystem } from "../../services/memorySystem";

interface MemoryViewerProps {}

export function MemoryApp({}: MemoryViewerProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "conversations" | "profile" | "analytics" | "settings"
  >("conversations");
  const [conversations, setConversations] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadMemoryData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = memorySystem.searchConversations(searchQuery, 20);
      setFilteredConversations(results);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const loadMemoryData = () => {
    const recentConversations = memorySystem.getRecentConversations(50);
    setConversations(recentConversations);
    setFilteredConversations(recentConversations);
    setUserProfile(memorySystem.getUserProfile());
    setStats(memorySystem.getMemoryStats());
  };

  const handleProfileUpdate = (field: string, value: any) => {
    const updates = { [field]: value };
    memorySystem.updateUserProfile(updates);
    setUserProfile((prev: any) => ({ ...prev, ...updates }));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !userProfile.interests.includes(interest)) {
      const newInterests = [...userProfile.interests, interest.trim()];
      handleProfileUpdate("interests", newInterests);
    }
  };

  const removeInterest = (interest: string) => {
    const newInterests = userProfile.interests.filter(
      (i: string) => i !== interest,
    );
    handleProfileUpdate("interests", newInterests);
  };

  const addGoal = (goal: string) => {
    if (goal.trim() && !userProfile.goals.includes(goal)) {
      const newGoals = [...userProfile.goals, goal.trim()];
      handleProfileUpdate("goals", newGoals);
    }
  };

  const removeGoal = (goal: string) => {
    const newGoals = userProfile.goals.filter((g: string) => g !== goal);
    handleProfileUpdate("goals", newGoals);
  };

  const exportMemoryData = async () => {
    setIsExporting(true);
    try {
      const exportData = memorySystem.exportMemoryData();
      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sios-memory-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const importMemoryData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = memorySystem.importMemoryData(content);
        if (success) {
          loadMemoryData();
          alert("Memory data imported successfully!");
        } else {
          alert("Failed to import memory data. Please check the file format.");
        }
      } catch (error) {
        alert("Error reading file: " + error);
      }
    };
    reader.readAsText(file);
  };

  const clearAllMemory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear ALL memory data? This action cannot be undone.",
    );
    if (confirmed) {
      memorySystem.clearAllMemory();
      loadMemoryData();
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  const ConversationsTab = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <div className="absolute right-3 top-2.5 text-white/40">🔍</div>
      </div>

      {/* Conversations List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-white/60">
                {formatDate(conv.timestamp)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">
                  Importance: {conv.importance}/10
                </span>
                {conv.emotions && conv.emotions.length > 0 && (
                  <span className="text-sm">{conv.emotions.join("")}</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-blue-400 font-medium">You:</span>{" "}
                {conv.userMessage}
              </div>
              <div className="text-sm">
                <span className="text-pink-400 font-medium">Sam:</span>{" "}
                {conv.aiResponse}
              </div>
            </div>
            {conv.tags && conv.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {conv.tags.slice(0, 5).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileTab = () => {
    const [newInterest, setNewInterest] = useState("");
    const [newGoal, setNewGoal] = useState("");

    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Name</label>
              <input
                type="text"
                value={userProfile.name || ""}
                onChange={(e) => handleProfileUpdate("name", e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">
                Pronouns
              </label>
              <input
                type="text"
                value={userProfile.pronouns || ""}
                onChange={(e) =>
                  handleProfileUpdate("pronouns", e.target.value)
                }
                placeholder="they/them, he/him, she/her"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Communication Style
            </label>
            <select
              value={userProfile.communication_style || "casual"}
              onChange={(e) =>
                handleProfileUpdate("communication_style", e.target.value)
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="direct">Direct</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Interests</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addInterest(newInterest);
                  setNewInterest("");
                }
              }}
            />
            <button
              onClick={() => {
                addInterest(newInterest);
                setNewInterest("");
              }}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded hover:bg-blue-500/30 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests?.map((interest: string) => (
              <span
                key={interest}
                className="px-3 py-1 bg-white/10 text-white rounded-full text-sm flex items-center gap-2 group hover:bg-red-500/20 transition-colors cursor-pointer"
                onClick={() => removeInterest(interest)}
              >
                {interest}
                <span className="opacity-50 group-hover:opacity-100">×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Goals</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a goal..."
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addGoal(newGoal);
                  setNewGoal("");
                }
              }}
            />
            <button
              onClick={() => {
                addGoal(newGoal);
                setNewGoal("");
              }}
              className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/40 rounded hover:bg-green-500/30 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.goals?.map((goal: string) => (
              <span
                key={goal}
                className="px-3 py-1 bg-white/10 text-white rounded-full text-sm flex items-center gap-2 group hover:bg-red-500/20 transition-colors cursor-pointer"
                onClick={() => removeGoal(goal)}
              >
                {goal}
                <span className="opacity-50 group-hover:opacity-100">×</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Memory Analytics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">
            {stats.totalConversations}
          </div>
          <div className="text-sm text-white/70">Total Conversations</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="text-2xl font-bold text-green-400">
            {stats.totalFacts}
          </div>
          <div className="text-sm text-white/70">Facts Learned</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">
            {stats.averageImportance?.toFixed(1) || "N/A"}
          </div>
          <div className="text-sm text-white/70">Avg. Importance</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="text-2xl font-bold text-pink-400">
            {stats.moodEntries}
          </div>
          <div className="text-sm text-white/70">Mood Entries</div>
        </div>
      </div>

      {stats.oldestConversation && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Memory Timeline</h4>
          <div className="text-sm text-white/70">
            First conversation: {formatDate(new Date(stats.oldestConversation))}
          </div>
          <div className="text-sm text-white/70">
            Last active: {formatDate(userProfile.last_active)}
          </div>
        </div>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Memory Settings</h3>

      <div className="space-y-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Export Data</h4>
          <p className="text-sm text-white/70 mb-3">
            Download all your memory data as a JSON file for backup or transfer.
          </p>
          <button
            onClick={exportMemoryData}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            {isExporting ? "Exporting..." : "Export Memory Data"}
          </button>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Import Data</h4>
          <p className="text-sm text-white/70 mb-3">
            Import previously exported memory data.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={importMemoryData}
            className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
          />
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
          <h4 className="font-semibold text-red-400 mb-2">⚠️ Danger Zone</h4>
          <p className="text-sm text-white/70 mb-3">
            Permanently delete all memory data. This action cannot be undone.
          </p>
          <button
            onClick={clearAllMemory}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded hover:bg-red-500/30 transition-colors"
          >
            Clear All Memory
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ResizableWindow appId="memory" title="🧠 Memory Viewer">
      <div className="flex flex-col h-full">
        {/* Tab Navigation */}
        <div className="border-b border-white/10 bg-white/5">
          <div className="flex">
            {[
              { id: "conversations", label: "Conversations", icon: "💬" },
              { id: "profile", label: "Profile", icon: "👤" },
              { id: "analytics", label: "Analytics", icon: "📊" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === tab.id
                    ? "border-white/40 text-white bg-white/10"
                    : "border-transparent text-white/70 hover:text-white hover:bg-white/5",
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "conversations" && <ConversationsTab />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </ResizableWindow>
  );
}
