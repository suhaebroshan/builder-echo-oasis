import { useTheme } from "../../contexts/ThemeContext";
import { AppPanel } from "../AppPanel";
import { cn } from "../../lib/utils";

export function CalendarApp() {
  const { theme } = useTheme();

  return (
    <AppPanel appId="calendar" title="📆 Calendar">
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="text-6xl mb-4">📆</div>
        <h2
          className={cn(
            "text-2xl font-semibold mb-2",
            theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
          )}
        >
          Calendar Coming Soon
        </h2>
        <p className="text-white/60 max-w-md">
          Schedule appointments, set reminders, and manage your time with AI
          assistance.
        </p>
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/40">
            Sam will handle calendar integration and AI scheduling features.
          </p>
        </div>
      </div>
    </AppPanel>
  );
}
