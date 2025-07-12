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

const App = () => (
  <ThemeProvider>
    <div className="w-full h-screen overflow-hidden bg-black font-poppins">
      {/* Main SIOS Launcher */}
      <SIOSLauncher />

      {/* App Panels */}
      <ChatApp />
      <SettingsApp />
      <PersonalityApp />
      <CalendarApp />
      <CallApp />
      <MemoryApp />
    </div>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
