import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppStore } from "../../stores/appStore";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  icon: string;
  type: "personality" | "contact";
}

export function CallApp() {
  const { theme } = useTheme();
  const { apps, openApp } = useAppStore();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialNumber, setDialNumber] = useState("");
  const [currentCall, setCurrentCall] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load personality contacts
  useEffect(() => {
    const personalityContacts: Contact[] = Object.values(apps)
      .filter((app) => app.type === "personality")
      .map((app) => ({
        id: app.id,
        name: app.name,
        phoneNumber: app.phoneNumber || "000",
        icon: app.icon,
        type: "personality" as const,
      }));

    setContacts(personalityContacts);
  }, [apps]);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber.includes(searchTerm),
  );

  const handleStartCall = (contact?: Contact) => {
    if (contact) {
      setCurrentCall(contact);
    } else if (dialNumber) {
      // Find contact by phone number
      const foundContact = contacts.find((c) => c.phoneNumber === dialNumber);
      setCurrentCall(
        foundContact || {
          id: "unknown",
          name: "Unknown",
          phoneNumber: dialNumber,
          icon: "📞",
          type: "contact",
        },
      );
    } else {
      return;
    }

    setIsCallActive(true);
    setCallDuration(0);

    // Start call timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Auto-end call after 30 seconds for demo
    setTimeout(() => {
      handleEndCall();
      clearInterval(timer);
    }, 30000);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setCurrentCall(null);
    setDialNumber("");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleContactChat = (contact: Contact) => {
    if (contact.type === "personality") {
      openApp(contact.id);
    }
  };

  return (
    <ResizableWindow appId="call" title="📞 Call AI">
      {!isCallActive ? (
        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <input
              type="text"
              placeholder="Search contacts or enter phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20",
                "text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all",
                theme === "sam"
                  ? "focus:ring-sam-pink focus:border-sam-pink/50"
                  : "focus:ring-nova-blue focus:border-nova-blue/50",
              )}
            />
          </div>

          {/* Manual Dialer */}
          <div className="p-4 border-b border-white/10">
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Enter phone number"
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20",
                  "text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all",
                  theme === "sam"
                    ? "focus:ring-sam-pink focus:border-sam-pink/50"
                    : "focus:ring-nova-blue focus:border-nova-blue/50",
                )}
              />
              <button
                onClick={() => handleStartCall()}
                disabled={!dialNumber}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-all",
                  dialNumber
                    ? "bg-green-500 hover:bg-green-400 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed",
                )}
              >
                Call
              </button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              AI Personalities
            </h3>
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{contact.icon}</span>
                    <div>
                      <h4 className="font-medium text-white">{contact.name}</h4>
                      <p className="text-sm text-white/60">
                        {contact.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleContactChat(contact)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        theme === "sam"
                          ? "bg-sam-pink/20 hover:bg-sam-pink/30 text-sam-pink"
                          : "bg-nova-blue/20 hover:bg-nova-blue/30 text-nova-cyan",
                      )}
                      title="Chat"
                    >
                      💬
                    </button>
                    <button
                      onClick={() => handleStartCall(contact)}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                      title="Call"
                    >
                      📞
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
          <div className="text-8xl mb-6 animate-pulse">
            {currentCall?.icon || "🗣️"}
          </div>
          <h2
            className={cn(
              "text-2xl font-semibold mb-2",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            {currentCall?.name || "Unknown"}
          </h2>
          <p className="text-white/60 mb-4">
            Duration: {formatDuration(callDuration)}
          </p>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
            <span className="text-sm text-white/60">Call in progress...</span>
          </div>

          {/* Call Controls */}
          <div className="flex gap-4 mb-8">
            <button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors flex items-center justify-center">
              🔇
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors flex items-center justify-center">
              🎤
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors flex items-center justify-center">
              📢
            </button>
          </div>

          <button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 bg-red-500 hover:bg-red-400 text-white shadow-glow"
          >
            ❌
          </button>
        </div>
      )}
    </ResizableWindow>
  );
}
