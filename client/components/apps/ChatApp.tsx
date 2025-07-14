import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";
import { openRouterService } from "../../services/openrouter";
import { elevenLabsService } from "../../services/elevenlabs";
import { notificationService } from "../../services/notifications";
import { emotionEngine } from "../../services/emotions";
import { advancedEmotionEngine } from "../../services/advancedEmotions";
import { personalityEngine } from "../../services/personalityCore";
import { gestureEngine } from "../../services/gestureEngine";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
  emotions?: string; // Emoji representation of emotions
  consciousness?: {
    awareness: number;
    coherence: number;
    authenticity: number;
  };
  personalityTraits?: string[]; // Visible personality traits in response
}

interface ChatBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

function ChatBubble({ message, isUser }: ChatBubbleProps) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] px-4 py-3 rounded-2xl backdrop-blur-md",
          "border transition-all duration-200",
          isUser
            ? cn(
                "rounded-br-md ml-4",
                theme === "sam"
                  ? "bg-sam-gray/60 border-sam-gray/40 text-white"
                  : "bg-gray-700/60 border-gray-600/40 text-white",
              )
            : cn(
                "rounded-bl-md mr-4",
                theme === "sam"
                  ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink"
                  : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan",
              ),
          message.isStreaming && "animate-pulse",
        )}
      >
        <div className="flex items-start gap-2">
          {message.emotions && message.sender === "assistant" && (
            <span className="text-lg flex-shrink-0 mt-0.5">
              {message.emotions}
            </span>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
            )}
          </p>
        </div>
        <span className="text-xs opacity-60 mt-1 block">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export function ChatApp() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Yo! What's good? I'm Sam, your AI assistant with that urban edge. Ready to help you out! 🔥",
      sender: "assistant",
      timestamp: new Date(),
      emotions: "😎🔥", // confident and excited
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Request notification permission on mount
    notificationService.requestPermission();

    // Initialize Sam personality
    personalityEngine.setActivePersonality("sam");
  }, []);

  const getAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Convert messages to OpenRouter format
      const chatHistory = messages
        .filter((m) => !m.isStreaming)
        .map((m) => ({
          role:
            m.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        }));

      // Add current user message
      chatHistory.push({ role: "user", content: userMessage });

      // Analyze emotional context before response
      const detectedEmotions = emotionEngine.analyzeEmotionalContext(
        userMessage,
        "",
      );
      emotionEngine.updateEmotions(detectedEmotions);

      // Create streaming message
      const streamingMessageId = Date.now().toString();
      const streamingMessage: ChatMessage = {
        id: streamingMessageId,
        content: "",
        sender: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, streamingMessage]);

      // Get AI response with streaming and emotional context
      const emotionalContext = emotionEngine.getEmotionalContext();
      const enhancedChatHistory = [
        ...chatHistory.slice(0, -1), // All except last user message
        {
          role: "system" as const,
          content: `You are Sam. ${emotionalContext}`,
        },
        chatHistory[chatHistory.length - 1], // Last user message
      ];

      const fullResponse = await openRouterService.streamChatMessage(
        enhancedChatHistory,
        "sam", // Default personality for chat app
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg,
            ),
          );
        },
      );

      // Analyze emotions from Sam's response and update
      const responseEmotions = emotionEngine.analyzeEmotionalContext(
        userMessage,
        fullResponse,
      );
      emotionEngine.updateEmotions(responseEmotions, 40); // Lower intensity for response analysis

      // Get emotional display for the message
      const emotionalDisplay = emotionEngine.getEmotionalDisplay();

      // Finalize the message with emotions
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? {
                ...msg,
                content: fullResponse,
                isStreaming: false,
                emotions: emotionalDisplay,
              }
            : msg,
        ),
      );

      // Show notification if window is not focused
      if (!document.hasFocus()) {
        await notificationService.showAIResponse("Sam", fullResponse, () =>
          window.focus(),
        );
      }

      // Play TTS if enabled
      if (ttsEnabled && fullResponse) {
        try {
          await elevenLabsService.speakText(fullResponse);
        } catch (error) {
          console.error("TTS error:", error);
        }
      }
    } catch (error) {
      console.error("AI response error:", error);

      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content:
          "Yo, I'm having trouble connecting right now. My bad! Try again in a sec.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [
        ...prev.filter((m) => !m.isStreaming),
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    const messageText = inputText;
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    await getAIResponse(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) return;

    try {
      setIsRecording(true);
      const audioBlob = await elevenLabsService.recordAudio(5000); // 5 seconds
      const transcription = await elevenLabsService.speechToText(audioBlob);

      if (transcription.trim()) {
        setInputText(transcription);
      }
    } catch (error) {
      console.error("Voice input error:", error);
      notificationService.showSystemNotification(
        "Voice Input Error",
        "Failed to record or transcribe audio. Please check microphone permissions.",
      );
    } finally {
      setIsRecording(false);
    }
  };

  const clearChat = () => {
    // Reset Sam's emotional state
    emotionEngine.reset();

    setMessages([
      {
        id: "1",
        content: "Chat cleared! What's on your mind now? 🧹",
        sender: "assistant",
        timestamp: new Date(),
        emotions: "😌✨", // Fresh and ready
      },
    ]);
  };

  // Show Sam's emotional state in real-time
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({}); // Force re-render to update emotional display
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResizableWindow appId="chat" title="💬 Chat with Sam">
      <div className="flex flex-col h-full">
        {/* Header Controls */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={cn(
                  "p-2 rounded-lg transition-colors text-xs font-medium",
                  ttsEnabled
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "bg-white/10 text-white/60 border border-white/20",
                )}
                title="Toggle Text-to-Speech"
              >
                🔊 TTS
              </button>

              {/* Sam's Current Emotional State */}
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10 border border-white/20">
                <span className="text-sm">
                  {emotionEngine.getEmotionalDisplay() || "🤖"}
                </span>
                <div className="flex items-center gap-1 text-xs text-white/50">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isLoading
                        ? "bg-yellow-400 animate-pulse"
                        : "bg-green-400",
                    )}
                  />
                  {isLoading ? "Thinking..." : "Online"}
                </div>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 transition-colors text-xs"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isUser={message.sender === "user"}
            />
          ))}

          {isTyping && !messages.some((m) => m.isStreaming) && (
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

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 disabled:opacity-50"
            />

            <button
              onClick={handleVoiceInput}
              disabled={isRecording || isLoading}
              className={cn(
                "p-3 rounded-xl transition-all duration-200",
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-white/10 text-white/70 hover:bg-white/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              title="Voice Input (5s)"
            >
              {isRecording ? "🔴" : "🎤"}
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                theme === "sam"
                  ? "bg-sam-pink text-white hover:bg-sam-pink/80 disabled:bg-sam-pink/20"
                  : "bg-nova-blue text-white hover:bg-nova-blue/80 disabled:bg-nova-blue/20",
              )}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>

          {isRecording && (
            <div className="mt-2 text-center">
              <span className="text-xs text-red-400 animate-pulse">
                🎤 Recording... (speak now)
              </span>
            </div>
          )}
        </div>
      </div>
    </ResizableWindow>
  );
}
