import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { AppPanel } from "../AppPanel";
import { cn } from "../../lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
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
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
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
      content: "Hello! I'm Sam, your AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${content}". This is a placeholder response. Sam will handle the actual AI logic!`,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: Implement actual STT functionality
    if (!isListening) {
      console.log("Starting voice recording...");
      // Placeholder: simulate voice input after 2 seconds
      setTimeout(() => {
        setInputValue("This is a simulated voice input");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <AppPanel appId="chat" title="💬 Chat with Sam" fullscreen>
      <div className="flex flex-col h-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isUser={message.sender === "user"}
            />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl rounded-bl-md mr-4",
                  "backdrop-blur-md border",
                  theme === "sam"
                    ? "bg-sam-pink/20 border-sam-pink/40"
                    : "bg-nova-blue/20 border-nova-blue/40",
                )}
              >
                <div className="flex space-x-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      theme === "sam" ? "bg-sam-pink" : "bg-nova-cyan",
                    )}
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      theme === "sam" ? "bg-sam-pink" : "bg-nova-cyan",
                    )}
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      theme === "sam" ? "bg-sam-pink" : "bg-nova-cyan",
                    )}
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          className={cn(
            "p-4 border-t border-white/10",
            "backdrop-blur-md",
            theme === "sam" ? "bg-sam-black/40" : "bg-white/5",
          )}
        >
          <div className="flex items-end gap-3">
            {/* Voice Input Button */}
            <button
              onClick={toggleVoiceInput}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                "backdrop-blur-md border transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isListening
                  ? theme === "sam"
                    ? "bg-sam-pink/30 border-sam-pink text-sam-pink animate-pulse"
                    : "bg-nova-blue/30 border-nova-blue text-nova-cyan animate-pulse"
                  : "bg-white/10 border-white/20 text-white/60 hover:text-white hover:bg-white/20",
              )}
              aria-label={isListening ? "Stop recording" : "Start voice input"}
            >
              🎤
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening ? "Listening..." : "Type your message..."
                }
                disabled={isListening}
                className={cn(
                  "w-full px-4 py-3 rounded-2xl",
                  "bg-white/10 backdrop-blur-md border border-white/20",
                  "text-white placeholder-white/50",
                  "focus:outline-none focus:ring-2 transition-all",
                  theme === "sam"
                    ? "focus:ring-sam-pink focus:border-sam-pink/50"
                    : "focus:ring-nova-blue focus:border-nova-blue/50",
                  isListening && "cursor-not-allowed opacity-50",
                )}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isListening}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                "backdrop-blur-md border transition-all duration-200",
                "hover:scale-105 active:scale-95",
                inputValue.trim() && !isListening
                  ? theme === "sam"
                    ? "bg-sam-pink/30 border-sam-pink text-sam-pink hover:bg-sam-pink/50"
                    : "bg-nova-blue/30 border-nova-blue text-nova-cyan hover:bg-nova-blue/50"
                  : "bg-white/10 border-white/20 text-white/30 cursor-not-allowed",
              )}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </AppPanel>
  );
}
