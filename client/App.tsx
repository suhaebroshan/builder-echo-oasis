import "./global.css";

import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAppStore } from "./stores/appStore";
import { SIOSLauncher } from "./components/SIOSLauncher";
import { ChatApp } from "./components/apps/ChatApp";
import { SettingsApp } from "./components/apps/SettingsApp";
import { PersonalityApp } from "./components/apps/PersonalityApp";
import { CalendarApp } from "./components/apps/CalendarApp";
import { CallApp } from "./components/apps/CallApp";
import { MemoryApp } from "./components/apps/MemoryApp";
import { PersonalityChatApp } from "./components/apps/PersonalityChatApp";
import { AIAssistantApp } from "./components/apps/AIAssistantApp";

function AppContainer() {
  const { apps, getPersonalities } = useAppStore();
  const personalities = getPersonalities();

  return (
    <div className="w-full h-screen overflow-hidden bg-black font-poppins">
      {/* Main SIOS Launcher */}
      <SIOSLauncher />

      {/* System App Panels */}
      <ChatApp />
      <SettingsApp />
      <PersonalityApp />
      <CalendarApp />
      <CallApp />
      <MemoryApp />
      <AIAssistantApp />

      {/* Dynamic Personality Chat Apps */}
      {personalities.map((personality) => (
        <PersonalityChatApp key={personality.id} personality={personality} />
      ))}
    </div>
  );
}

const App = () => (
  <ThemeProvider>
    <AppContainer />
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
