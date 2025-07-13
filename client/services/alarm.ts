import { notificationService } from "./notifications";
import { elevenLabsService } from "./elevenlabs";

export interface Alarm {
  id: string;
  time: string; // HH:MM format
  message: string;
  isActive: boolean;
  daysOfWeek: number[]; // 0-6, Sunday = 0
  voiceEnabled: boolean;
  personality: "sam" | "nova" | "custom";
  snoozeCount: number;
}

export class AlarmService {
  private static instance: AlarmService;
  private alarms: Alarm[] = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private activeAlarmId: string | null = null;

  static getInstance(): AlarmService {
    if (!AlarmService.instance) {
      AlarmService.instance = new AlarmService();
    }
    return AlarmService.instance;
  }

  constructor() {
    this.loadAlarms();
    this.startChecking();
  }

  private loadAlarms(): void {
    try {
      const stored = localStorage.getItem("sios-alarms");
      if (stored) {
        this.alarms = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading alarms:", error);
      this.alarms = [];
    }
  }

  private saveAlarms(): void {
    try {
      localStorage.setItem("sios-alarms", JSON.stringify(this.alarms));
    } catch (error) {
      console.error("Error saving alarms:", error);
    }
  }

  private startChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkAlarms();
    }, 60000);

    // Also check immediately
    this.checkAlarms();
  }

  private async checkAlarms(): Promise<void> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const currentDay = now.getDay();

    for (const alarm of this.alarms) {
      if (
        alarm.isActive &&
        alarm.time === currentTime &&
        (alarm.daysOfWeek.length === 0 ||
          alarm.daysOfWeek.includes(currentDay)) &&
        this.activeAlarmId !== alarm.id
      ) {
        await this.triggerAlarm(alarm);
      }
    }
  }

  private async triggerAlarm(alarm: Alarm): Promise<void> {
    this.activeAlarmId = alarm.id;

    // Get personality-specific wake-up messages
    const messages = this.getWakeUpMessages(alarm.personality);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const fullMessage = alarm.message || randomMessage;

    // Show notification
    await notificationService.showAlarm(fullMessage, () => {
      this.dismissAlarm(alarm.id);
    });

    // Play voice if enabled
    if (alarm.voiceEnabled) {
      try {
        await elevenLabsService.speakText(fullMessage);
      } catch (error) {
        console.error("Failed to play alarm voice:", error);
      }
    }

    // Trigger fake call interface
    this.simulateWakeUpCall(alarm);

    // Auto-dismiss after 1 minute if not manually dismissed
    setTimeout(() => {
      if (this.activeAlarmId === alarm.id) {
        this.dismissAlarm(alarm.id);
      }
    }, 60000);
  }

  private simulateWakeUpCall(alarm: Alarm): void {
    // Create a fake call overlay
    const callOverlay = document.createElement("div");
    callOverlay.id = "sios-alarm-call";
    callOverlay.className = `
      fixed inset-0 z-[10000] flex flex-col items-center justify-center
      bg-gradient-to-br from-sam-black to-sam-gray backdrop-blur-xl
    `;

    const personalityIcon = alarm.personality === "sam" ? "🎨" : "🌟";
    const personalityName = alarm.personality === "sam" ? "Sam" : "Nova";

    callOverlay.innerHTML = `
      <div class="text-center text-white">
        <div class="text-8xl mb-6 animate-bounce">${personalityIcon}</div>
        <h1 class="text-3xl font-bold mb-2">Wake-up Call from ${personalityName}</h1>
        <p class="text-lg opacity-80 mb-8">${alarm.message}</p>
        <div class="flex gap-4">
          <button id="snooze-btn" class="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl font-semibold text-black transition-colors">
            😴 Snooze 5min
          </button>
          <button id="dismiss-btn" class="px-6 py-3 bg-red-500 hover:bg-red-400 rounded-xl font-semibold text-white transition-colors">
            ✅ I'm Awake
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(callOverlay);

    // Add event listeners
    const snoozeBtn = document.getElementById("snooze-btn");
    const dismissBtn = document.getElementById("dismiss-btn");

    snoozeBtn?.addEventListener("click", () => {
      this.snoozeAlarm(alarm.id);
      document.body.removeChild(callOverlay);
    });

    dismissBtn?.addEventListener("click", () => {
      this.dismissAlarm(alarm.id);
      document.body.removeChild(callOverlay);
    });

    // Auto-remove after 1 minute
    setTimeout(() => {
      if (document.getElementById("sios-alarm-call")) {
        document.body.removeChild(callOverlay);
      }
    }, 60000);
  }

  private getWakeUpMessages(personality: "sam" | "nova" | "custom"): string[] {
    if (personality === "sam") {
      return [
        "Yo, wake the hell up! Time to slay all day! 🔥",
        "Rise and shine, pookie. The world needs your energy! ⚡",
        "Wakey wakey, let's make some money! 💰",
        "Time to get up and be legendary! 🚀",
        "Morning sunshine! Stop being lazy and get moving! ☀️",
      ];
    } else if (personality === "nova") {
      return [
        "Good morning. Your optimal productivity window has begun.",
        "Time to activate your potential and achieve your goals.",
        "Initiating morning protocol. Please prepare for excellence.",
        "Your schedule awaits. Let's make today efficient and successful.",
        "Morning analysis complete. Time to execute your daily objectives.",
      ];
    } else {
      return [
        "Good morning! Time to start your day.",
        "Wake up! A new day of possibilities awaits.",
        "Rise and shine! Let's make today amazing.",
        "Time to get up and seize the day!",
        "Morning! Ready to take on the world?",
      ];
    }
  }

  addAlarm(alarm: Omit<Alarm, "id">): string {
    const id = `alarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlarm: Alarm = {
      ...alarm,
      id,
      snoozeCount: 0,
    };

    this.alarms.push(newAlarm);
    this.saveAlarms();
    return id;
  }

  updateAlarm(id: string, updates: Partial<Alarm>): boolean {
    const index = this.alarms.findIndex((alarm) => alarm.id === id);
    if (index === -1) return false;

    this.alarms[index] = { ...this.alarms[index], ...updates };
    this.saveAlarms();
    return true;
  }

  deleteAlarm(id: string): boolean {
    const index = this.alarms.findIndex((alarm) => alarm.id === id);
    if (index === -1) return false;

    this.alarms.splice(index, 1);
    this.saveAlarms();
    return true;
  }

  snoozeAlarm(id: string, minutes: number = 5): void {
    const alarm = this.alarms.find((a) => a.id === id);
    if (!alarm) return;

    alarm.snoozeCount++;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Create temporary snooze alarm
    this.addAlarm({
      time: snoozeTime,
      message: `Snooze #${alarm.snoozeCount}: ${alarm.message}`,
      isActive: true,
      daysOfWeek: [],
      voiceEnabled: alarm.voiceEnabled,
      personality: alarm.personality,
    });

    this.activeAlarmId = null;
  }

  dismissAlarm(id: string): void {
    this.activeAlarmId = null;
    // Remove any alarm call overlay if exists
    const overlay = document.getElementById("sios-alarm-call");
    if (overlay) {
      overlay.remove();
    }
  }

  getAlarms(): Alarm[] {
    return [...this.alarms];
  }

  toggleAlarm(id: string): boolean {
    const alarm = this.alarms.find((a) => a.id === id);
    if (!alarm) return false;

    alarm.isActive = !alarm.isActive;
    this.saveAlarms();
    return alarm.isActive;
  }

  cleanup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const alarmService = AlarmService.getInstance();
