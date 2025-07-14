export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = "default";
  private isEnabled: boolean = true;
  private soundEnabled: boolean = true;
  private lastNotificationTime: number = 0;
  private rateLimitMs: number = 3000; // 3 seconds between notifications

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    this.permission = Notification.permission;
    this.loadSettings();
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (this.permission === "granted") {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  async show(options: NotificationOptions): Promise<Notification | null> {
    // Check if notifications are enabled
    if (!this.isEnabled) {
      return null;
    }

    // Rate limiting to prevent spam
    const now = Date.now();
    if (now - this.lastNotificationTime < this.rateLimitMs) {
      return null;
    }
    this.lastNotificationTime = now;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn("Notification permission not granted");
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/favicon.ico",
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        actions: options.actions || [],
        silent: !this.soundEnabled,
      });

      // Auto close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Play custom sound if enabled
      if (this.soundEnabled && options.requireInteraction) {
        this.playNotificationSound();
      }

      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  }

  async showAIResponse(
    aiName: string,
    message: string,
    onClick?: () => void,
  ): Promise<void> {
    const notification = await this.show({
      title: `${aiName} replied`,
      body: message.length > 100 ? message.substring(0, 100) + "..." : message,
      icon: aiName === "Sam" ? "🎨" : aiName === "Nova" ? "🌟" : "🤖",
      tag: `ai-response-${aiName.toLowerCase()}`,
    });

    if (notification && onClick) {
      notification.onclick = onClick;
    }
  }

  async showAlarm(message: string, onClick?: () => void): Promise<void> {
    const notification = await this.show({
      title: "⏰ SIOS Alarm",
      body: message,
      icon: "⏰",
      tag: "sios-alarm",
      requireInteraction: true,
      actions: [
        { action: "snooze", title: "Snooze 5 min" },
        { action: "dismiss", title: "Dismiss" },
      ],
    });

    if (notification && onClick) {
      notification.onclick = onClick;
    }
  }

  async showSystemNotification(title: string, message: string): Promise<void> {
    await this.show({
      title: `SIOS: ${title}`,
      body: message,
      icon: "🤖",
      tag: "sios-system",
    });
  }

  isSupported(): boolean {
    return "Notification" in window;
  }

  hasPermission(): boolean {
    return this.permission === "granted";
  }

  // Settings management
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem("sios_notifications_enabled", enabled.toString());
  }

  isNotificationsEnabled(): boolean {
    return this.isEnabled;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem("sios_notifications_sound", enabled.toString());
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  setRateLimit(ms: number): void {
    this.rateLimitMs = Math.max(1000, ms); // Minimum 1 second
  }

  // Custom notification sounds
  private playNotificationSound(): void {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBSKHy+zTgSoHKn/H7eFSFA9LnuH92oYrBCAM+vfQ2UoBCE6hPGJzFnNFAAA",
      );
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fail silently if audio can't play
      });
    } catch (error) {
      // Fail silently
    }
  }

  // Specialized notifications
  async showCalendarEvent(event: any, onClick?: () => void): Promise<void> {
    const notification = await this.show({
      title: `📅 ${event.title}`,
      body: `${event.description || "Calendar event reminder"}`,
      icon: "📅",
      tag: `calendar-${event.id}`,
      requireInteraction: true,
      actions: [
        { action: "dismiss", title: "Dismiss" },
        { action: "snooze", title: "Remind me in 5 min" },
      ],
    });

    if (notification && onClick) {
      notification.onclick = onClick;
    }
  }

  async showMemoryReminder(
    message: string,
    onClick?: () => void,
  ): Promise<void> {
    const notification = await this.show({
      title: "🧠 Memory Reminder",
      body: message,
      icon: "🧠",
      tag: "memory-reminder",
    });

    if (notification && onClick) {
      notification.onclick = onClick;
    }
  }

  async showWelcomeBack(userName?: string): Promise<void> {
    const name = userName || "User";
    await this.show({
      title: "👋 Welcome back to SIOS!",
      body: `Hey ${name}! Sam is ready to assist you. What would you like to do today?`,
      icon: "🤖",
      tag: "welcome-back",
    });
  }

  // Load settings from localStorage
  private loadSettings(): void {
    const enabled = localStorage.getItem("sios_notifications_enabled");
    if (enabled !== null) {
      this.isEnabled = enabled === "true";
    }

    const sound = localStorage.getItem("sios_notifications_sound");
    if (sound !== null) {
      this.soundEnabled = sound === "true";
    }
  }
}

export const notificationService = NotificationService.getInstance();
