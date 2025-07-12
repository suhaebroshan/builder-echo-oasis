import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { AppPanel } from "../AppPanel";
import { cn } from "../../lib/utils";

export function CallApp() {
  const { theme } = useTheme();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleStartCall = () => {
    setIsCallActive(true);
    // TODO: Start actual voice call with AI
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Simulate call ending after 10 seconds for demo
    setTimeout(() => {
      setIsCallActive(false);
      setCallDuration(0);
      clearInterval(timer);
    }, 10000);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <AppPanel appId="call" title="📞 Call AI">
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        {!isCallActive ? (
          <>
            <div className="text-8xl mb-6">🤖</div>
            <h2
              className={cn(
                "text-2xl font-semibold mb-2",
                theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
              )}
            >
              Sam AI
            </h2>
            <p className="text-white/60 mb-8">Ready for voice conversation</p>
            <button
              onClick={handleStartCall}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                "text-2xl transition-all duration-200 hover:scale-110",
                "bg-green-500 hover:bg-green-400 text-white shadow-glow",
              )}
            >
              📞
            </button>
          </>
        ) : (
          <>
            <div className="text-8xl mb-6 animate-pulse">🗣️</div>
            <h2
              className={cn(
                "text-2xl font-semibold mb-2",
                theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
              )}
            >
              Call in Progress
            </h2>
            <p className="text-white/60 mb-4">
              Duration: {formatDuration(callDuration)}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
              <span className="text-sm text-white/60">AI is listening...</span>
            </div>
            <button
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 bg-red-500 hover:bg-red-400 text-white shadow-glow"
            >
              ❌
            </button>
          </>
        )}

        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 max-w-md">
          <p className="text-sm text-white/40">
            Voice calling features will be handled by Sam's TTS/STT integration.
          </p>
        </div>
      </div>
    </AppPanel>
  );
}
