import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";

interface MemoryItem {
  id: string;
  type: "conversation" | "fact" | "preference";
  content: string;
  timestamp: Date;
  relevance: number;
}

const mockMemories: MemoryItem[] = [
  {
    id: "1",
    type: "conversation",
    content: "User prefers dark mode interfaces",
    timestamp: new Date(Date.now() - 86400000),
    relevance: 0.9,
  },
  {
    id: "2",
    type: "fact",
    content: "User is building an AI operating system called SIOS",
    timestamp: new Date(Date.now() - 3600000),
    relevance: 0.95,
  },
  {
    id: "3",
    type: "preference",
    content: "Prefers Sam theme over Nova theme",
    timestamp: new Date(Date.now() - 1800000),
    relevance: 0.7,
  },
];

export function MemoryApp() {
  const { theme } = useTheme();

  const getTypeIcon = (type: MemoryItem["type"]) => {
    switch (type) {
      case "conversation":
        return "💬";
      case "fact":
        return "📝";
      case "preference":
        return "❤️";
    }
  };

  const getTypeColor = (type: MemoryItem["type"]) => {
    switch (type) {
      case "conversation":
        return "text-blue-400";
      case "fact":
        return "text-green-400";
      case "preference":
        return "text-purple-400";
    }
  };

  return (
    <ResizableWindow appId="memory" title="🧠 Memory Viewer">
      <div className="p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2
            className={cn(
              "text-xl font-semibold",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            AI Memory Bank
          </h2>
          <div className="text-sm text-white/60">
            {mockMemories.length} memories stored
          </div>
        </div>

        <div className="space-y-4">
          {mockMemories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(memory.type)}</span>
                  <div>
                    <span
                      className={cn(
                        "text-xs uppercase font-medium",
                        getTypeColor(memory.type),
                      )}
                    >
                      {memory.type}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          memory.relevance > 0.8
                            ? "bg-green-400"
                            : memory.relevance > 0.6
                              ? "bg-yellow-400"
                              : "bg-gray-400",
                        )}
                      />
                      <span className="text-xs text-white/40">
                        {Math.round(memory.relevance * 100)}% relevance
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-white/40">
                  {memory.timestamp.toLocaleDateString()}
                </span>
              </div>
              <p className="text-white/80">{memory.content}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-4xl mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Memory System
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Sam maintains contextual memory of your conversations,
              preferences, and important facts.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">💬</div>
                <div className="text-xs text-white/40">Conversations</div>
              </div>
              <div>
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs text-white/40">Facts</div>
              </div>
              <div>
                <div className="text-2xl mb-1">❤️</div>
                <div className="text-xs text-white/40">Preferences</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResizableWindow>
  );
}
