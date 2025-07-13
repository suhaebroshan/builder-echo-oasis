import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";
import { alarmService, type Alarm } from "../../services/alarm";

export function AlarmApp() {
  const { theme } = useTheme();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    time: "07:00",
    message: "",
    isActive: true,
    daysOfWeek: [] as number[],
    voiceEnabled: true,
    personality: "sam" as "sam" | "nova" | "custom",
  });

  const daysOfWeekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = () => {
    setAlarms(alarmService.getAlarms());
  };

  const handleAddAlarm = () => {
    if (!newAlarm.time) return;

    const defaultMessage =
      newAlarm.personality === "sam"
        ? "Yo, wake the hell up! Time to slay all day! 🔥"
        : newAlarm.personality === "nova"
          ? "Good morning. Your optimal productivity window has begun."
          : "Good morning! Time to start your day.";

    alarmService.addAlarm({
      ...newAlarm,
      message: newAlarm.message || defaultMessage,
    });

    setNewAlarm({
      time: "07:00",
      message: "",
      isActive: true,
      daysOfWeek: [],
      voiceEnabled: true,
      personality: "sam",
    });

    setShowAddForm(false);
    loadAlarms();
  };

  const handleToggleAlarm = (id: string) => {
    alarmService.toggleAlarm(id);
    loadAlarms();
  };

  const handleDeleteAlarm = (id: string) => {
    alarmService.deleteAlarm(id);
    loadAlarms();
  };

  const handleToggleDay = (day: number) => {
    setNewAlarm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const formatDaysOfWeek = (days: number[]): string => {
    if (days.length === 0) return "Once";
    if (days.length === 7) return "Daily";
    if (days.length === 5 && !days.includes(0) && !days.includes(6))
      return "Weekdays";
    if (days.length === 2 && days.includes(0) && days.includes(6))
      return "Weekends";

    return days
      .sort()
      .map((d) => daysOfWeekLabels[d])
      .join(", ");
  };

  return (
    <ResizableWindow appId="alarm" title="⏰ Alarms & Wake-up">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2
            className={cn(
              "text-xl font-semibold",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            Wake-up Alarms
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className={cn(
              "px-4 py-2 rounded-lg backdrop-blur-md border",
              "text-sm font-medium transition-colors",
              theme === "sam"
                ? "bg-sam-pink/20 border-sam-pink/40 text-sam-pink hover:bg-sam-pink/30"
                : "bg-nova-blue/20 border-nova-blue/40 text-nova-cyan hover:bg-nova-blue/30",
            )}
          >
            + Add Alarm
          </button>
        </div>

        {/* Alarms List */}
        <div className="space-y-4">
          {alarms.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <div className="text-6xl mb-4">⏰</div>
              <p>No alarms set</p>
              <p className="text-sm">Create one to get wake-up calls!</p>
            </div>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={cn(
                  "p-4 rounded-xl backdrop-blur-md border transition-all",
                  alarm.isActive
                    ? "bg-white/10 border-white/20"
                    : "bg-white/5 border-white/10 opacity-50",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-mono text-white">
                        {alarm.time}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          alarm.personality === "sam"
                            ? "bg-sam-pink/20 text-sam-pink"
                            : alarm.personality === "nova"
                              ? "bg-nova-blue/20 text-nova-cyan"
                              : "bg-white/20 text-white",
                        )}
                      >
                        {alarm.personality.toUpperCase()}
                      </span>
                      {alarm.voiceEnabled && (
                        <span className="text-xs text-green-400">🔊</span>
                      )}
                    </div>
                    <p className="text-sm text-white/80 mt-1">
                      {alarm.message}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {formatDaysOfWeek(alarm.daysOfWeek)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAlarm(alarm.id)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all duration-200",
                        "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                        alarm.isActive
                          ? theme === "sam"
                            ? "bg-sam-pink border-sam-pink focus:ring-sam-pink"
                            : "bg-nova-blue border-nova-blue focus:ring-nova-blue"
                          : "bg-gray-600 border-gray-500 focus:ring-gray-400",
                      )}
                    >
                      <span
                        className={cn(
                          "block w-4 h-4 rounded-full bg-white transition-transform duration-200",
                          alarm.isActive ? "translate-x-6" : "translate-x-0",
                        )}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteAlarm(alarm.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Alarm Form */}
        {showAddForm && (
          <div
            className={cn(
              "p-4 rounded-xl backdrop-blur-xl border",
              theme === "sam"
                ? "bg-sam-black/60 border-sam-pink/40"
                : "bg-gray-900/60 border-nova-blue/40",
            )}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Create New Alarm
            </h3>

            <div className="space-y-4">
              {/* Time */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Time</label>
                <input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) =>
                    setNewAlarm((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Wake-up Message
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for default personality message"
                  value={newAlarm.message}
                  onChange={(e) =>
                    setNewAlarm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              {/* Personality */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  AI Personality
                </label>
                <select
                  value={newAlarm.personality}
                  onChange={(e) =>
                    setNewAlarm((prev) => ({
                      ...prev,
                      personality: e.target.value as "sam" | "nova" | "custom",
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="sam">Sam (Urban & Energetic)</option>
                  <option value="nova">Nova (Professional & Analytical)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Days of Week */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Repeat On (leave empty for once)
                </label>
                <div className="flex gap-2">
                  {daysOfWeekLabels.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => handleToggleDay(index)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xs font-medium transition-colors",
                        newAlarm.daysOfWeek.includes(index)
                          ? theme === "sam"
                            ? "bg-sam-pink text-white"
                            : "bg-nova-blue text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/20",
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70">
                  Enable Voice Alarm
                </label>
                <button
                  onClick={() =>
                    setNewAlarm((prev) => ({
                      ...prev,
                      voiceEnabled: !prev.voiceEnabled,
                    }))
                  }
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-all duration-200",
                    "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    newAlarm.voiceEnabled
                      ? theme === "sam"
                        ? "bg-sam-pink border-sam-pink focus:ring-sam-pink"
                        : "bg-nova-blue border-nova-blue focus:ring-nova-blue"
                      : "bg-gray-600 border-gray-500 focus:ring-gray-400",
                  )}
                >
                  <span
                    className={cn(
                      "block w-4 h-4 rounded-full bg-white transition-transform duration-200",
                      newAlarm.voiceEnabled ? "translate-x-6" : "translate-x-0",
                    )}
                  />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddAlarm}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    theme === "sam"
                      ? "bg-sam-pink text-white hover:bg-sam-pink/80"
                      : "bg-nova-blue text-white hover:bg-nova-blue/80",
                  )}
                >
                  Create Alarm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResizableWindow>
  );
}
