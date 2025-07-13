import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "command" | "system";
}

interface AICapability {
  name: string;
  description: string;
  icon: string;
  category: string;
}

const AI_CAPABILITIES: AICapability[] = [
  {
    name: "Code Generation",
    description: "Generate and debug code in multiple languages",
    icon: "💻",
    category: "Development",
  },
  {
    name: "Data Analysis",
    description: "Analyze datasets and create visualizations",
    icon: "📊",
    category: "Analytics",
  },
  {
    name: "Creative Writing",
    description: "Help with stories, poems, and creative content",
    icon: "✍️",
    category: "Creative",
  },
  {
    name: "Problem Solving",
    description: "Break down complex problems step by step",
    icon: "🧩",
    category: "Logic",
  },
  {
    name: "Research",
    description: "Gather and synthesize information on topics",
    icon: "🔍",
    category: "Knowledge",
  },
  {
    name: "Language Translation",
    description: "Translate between multiple languages",
    icon: "🌐",
    category: "Language",
  },
];

export function AIAssistantApp() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your advanced AI assistant. I can help you with coding, analysis, creative tasks, and much more. What would you like to work on today?",
      sender: "ai",
      timestamp: new Date(),
      type: "system",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "chat" | "capabilities" | "settings"
  >("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(
      () => {
        const responses = [
          "I understand you're asking about: " +
            userMessage +
            ". Let me help you with that.",
          "That's an interesting question! Here's what I think about: " +
            userMessage,
          "Based on your input '" +
            userMessage +
            "', I can provide several insights...",
          "Let me break down your request about '" +
            userMessage +
            "' step by step.",
          "I'd be happy to help with " + userMessage + ". Here's my analysis:",
        ];

        const response =
          responses[Math.floor(Math.random() * responses.length)];

        const newMessage: Message = {
          id: Date.now().toString(),
          text: response,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    simulateAIResponse(inputText);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[70%] p-3 rounded-2xl backdrop-blur-md border",
                message.sender === "user"
                  ? theme === "sam"
                    ? "bg-sam-pink/20 border-sam-pink/40 text-white"
                    : "bg-nova-blue/20 border-nova-blue/40 text-white"
                  : "bg-white/10 border-white/20 text-white",
                message.type === "system" &&
                  "bg-white/5 border-white/10 text-white/80",
              )}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 p-3 rounded-2xl backdrop-blur-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              theme === "sam"
                ? "bg-sam-pink text-white hover:bg-sam-pink/80 disabled:bg-sam-pink/20"
                : "bg-nova-blue text-white hover:bg-nova-blue/80 disabled:bg-nova-blue/20",
            )}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderCapabilitiesTab = () => (
    <div className="p-6 space-y-6 overflow-y-auto">
      <h3
        className={cn(
          "text-xl font-semibold",
          theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
        )}
      >
        AI Capabilities
      </h3>

      <div className="grid gap-4">
        {AI_CAPABILITIES.map((capability, index) => (
          <div
            key={index}
            className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => {
              setActiveTab("chat");
              setInputText(`Tell me more about ${capability.name}`);
              inputRef.current?.focus();
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{capability.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    {capability.name}
                  </h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                    {capability.category}
                  </span>
                </div>
                <p className="text-sm text-white/60 mt-1">
                  {capability.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="p-6 space-y-6 overflow-y-auto">
      <h3
        className={cn(
          "text-xl font-semibold",
          theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
        )}
      >
        Assistant Settings
      </h3>

      <div className="space-y-4">
        <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
          <h4 className="font-medium text-white mb-2">Response Style</h4>
          <select className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30">
            <option value="balanced">Balanced</option>
            <option value="creative">Creative</option>
            <option value="precise">Precise</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
          <h4 className="font-medium text-white mb-2">Response Length</h4>
          <select className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
          <button
            onClick={() =>
              setMessages([
                {
                  id: "1",
                  text: "Chat history cleared. How can I help you today?",
                  sender: "ai",
                  timestamp: new Date(),
                  type: "system",
                },
              ])
            }
            className="w-full px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Clear Chat History
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ResizableWindow appId="ai-assistant" title="🤖 AI Assistant">
      <div className="h-full flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-white/5">
          {[
            { id: "chat", label: "Chat", icon: "💬" },
            { id: "capabilities", label: "Capabilities", icon: "⚡" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all",
                "hover:bg-white/10",
                activeTab === tab.id
                  ? theme === "sam"
                    ? "text-sam-pink border-b-2 border-sam-pink bg-white/5"
                    : "text-nova-cyan border-b-2 border-nova-cyan bg-white/5"
                  : "text-white/70",
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0">
          {activeTab === "chat" && renderChatTab()}
          {activeTab === "capabilities" && renderCapabilitiesTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </div>
      </div>
    </ResizableWindow>
  );
}
