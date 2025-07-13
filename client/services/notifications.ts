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

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    this.permission = Notification.permission;
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
      });

      // Auto close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
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
}

export const notificationService = NotificationService.getInstance();
