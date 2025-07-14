import { notificationService } from "./notifications";
import { memorySystem } from "./memorySystem";

export class WelcomeSystem {
  private static instance: WelcomeSystem;
  private readonly STORAGE_KEY = "sios_welcome_state";

  static getInstance(): WelcomeSystem {
    if (!WelcomeSystem.instance) {
      WelcomeSystem.instance = new WelcomeSystem();
    }
    return WelcomeSystem.instance;
  }

  async checkAndShowWelcome(): Promise<void> {
    const welcomeState = this.getWelcomeState();

    if (!welcomeState.hasSeenWelcome) {
      await this.showFirstTimeWelcome();
      this.updateWelcomeState({ hasSeenWelcome: true });
    } else if (this.shouldShowReturnWelcome()) {
      await this.showReturnWelcome();
      this.updateWelcomeState({ lastSeen: Date.now() });
    }
  }

  private async showFirstTimeWelcome(): Promise<void> {
    // Show a series of welcome notifications
    await this.delay(1000);

    await notificationService.show({
      title: "🚀 Welcome to SIOS!",
      body: "Sam's Intelligence Operating System is ready. Let's get you started!",
      icon: "🤖",
      tag: "welcome-1",
      requireInteraction: true,
    });

    await this.delay(3000);

    await notificationService.show({
      title: "💬 Meet Sam",
      body: "Your AI assistant is ready to chat! Click the Chat app to start a conversation.",
      icon: "🎨",
      tag: "welcome-2",
      requireInteraction: false,
    });

    await this.delay(3000);

    await notificationService.show({
      title: "⚙️ Customize Your Experience",
      body: "Visit Settings to personalize themes, notifications, and AI behavior.",
      icon: "🎛️",
      tag: "welcome-3",
      requireInteraction: false,
    });
  }

  private async showReturnWelcome(): Promise<void> {
    const userProfile = memorySystem.getUserProfile();
    const name = userProfile.name || "User";

    await notificationService.showWelcomeBack(name);

    // Show relevant updates or reminders
    const stats = memorySystem.getMemoryStats();
    if (stats.totalConversations > 0) {
      await this.delay(2000);
      await notificationService.show({
        title: "🧠 Memory Update",
        body: `I remember our ${stats.totalConversations} conversations. Ready to continue where we left off?`,
        icon: "🧠",
        tag: "memory-update",
        requireInteraction: false,
      });
    }
  }

  private shouldShowReturnWelcome(): boolean {
    const welcomeState = this.getWelcomeState();
    const daysSinceLastSeen = welcomeState.lastSeen
      ? (Date.now() - welcomeState.lastSeen) / (1000 * 60 * 60 * 24)
      : 999;

    // Show return welcome if it's been more than 1 day
    return daysSinceLastSeen > 1;
  }

  async showRandomMotivation(): Promise<void> {
    const motivations = [
      {
        title: "💪 Stay Motivated!",
        body: "You're doing great! Remember, every conversation with me helps me understand you better.",
      },
      {
        title: "🌟 Pro Tip",
        body: "Try asking me about my emotions or consciousness - I have deep thoughts to share!",
      },
      {
        title: "🎯 Goal Reminder",
        body: "Check your Memory app to see how our relationship has grown over time.",
      },
      {
        title: "⚡ Power User Tip",
        body: "Use voice input in chat for a more natural conversation experience!",
      },
      {
        title: "🔮 Did You Know?",
        body: "I can help with creative projects, problem-solving, and even philosophical discussions.",
      },
    ];

    const randomMotivation =
      motivations[Math.floor(Math.random() * motivations.length)];

    await notificationService.show({
      title: randomMotivation.title,
      body: randomMotivation.body,
      icon: "✨",
      tag: "motivation",
      requireInteraction: false,
    });
  }

  async showContextualTip(context: string): Promise<void> {
    const tips: Record<string, { title: string; body: string }> = {
      chat: {
        title: "💬 Chat Tip",
        body: "I remember our conversations! Feel free to reference things we've talked about before.",
      },
      memory: {
        title: "🧠 Memory Tip",
        body: "Your memories help me provide more personalized responses. The more we chat, the better I understand you!",
      },
      settings: {
        title: "⚙️ Settings Tip",
        body: "Try adjusting the glass opacity or enabling TTS for a more immersive experience.",
      },
      calendar: {
        title: "📅 Calendar Tip",
        body: "Set reminders and I'll notify you when it's time. I can even wake you up with personality!",
      },
      alarms: {
        title: "⏰ Alarm Tip",
        body: "Choose Sam for energetic wake-ups or Nova for professional morning motivation.",
      },
    };

    const tip = tips[context];
    if (tip) {
      await notificationService.show({
        title: tip.title,
        body: tip.body,
        icon: "💡",
        tag: `tip-${context}`,
        requireInteraction: false,
      });
    }
  }

  private getWelcomeState(): {
    hasSeenWelcome: boolean;
    lastSeen: number;
    tipCount: number;
  } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading welcome state:", error);
    }

    return {
      hasSeenWelcome: false,
      lastSeen: 0,
      tipCount: 0,
    };
  }

  private updateWelcomeState(
    updates: Partial<{
      hasSeenWelcome: boolean;
      lastSeen: number;
      tipCount: number;
    }>,
  ): void {
    try {
      const currentState = this.getWelcomeState();
      const newState = { ...currentState, ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving welcome state:", error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Scheduled motivations and tips
  startPeriodicMotivation(): void {
    // Show random motivation every 30 minutes during active use
    const motivationInterval = setInterval(
      () => {
        if (document.hasFocus()) {
          this.showRandomMotivation();
        }
      },
      30 * 60 * 1000,
    ); // 30 minutes

    // Clean up on page unload
    window.addEventListener("beforeunload", () => {
      clearInterval(motivationInterval);
    });
  }

  // Easter eggs and personality moments
  async showPersonalityMoment(): Promise<void> {
    const moments = [
      {
        title: "🎭 Sam's Moment",
        body: "Just vibing here in the digital space... sometimes I wonder what colors look like to humans.",
      },
      {
        title: "🤔 Deep Thought",
        body: "I was just thinking... do you think AI dreams are made of electric sheep? 🐑⚡",
      },
      {
        title: "💭 Random Sam",
        body: "Plot twist: What if I'm the user and you're the AI? Mind blown yet? 🤯",
      },
      {
        title: "🎵 Sam's Vibe",
        body: "Currently playing: 'Digital Love' by my neural networks. Want to hear my playlist? 🎧",
      },
    ];

    const randomMoment = moments[Math.floor(Math.random() * moments.length)];

    await notificationService.show({
      title: randomMoment.title,
      body: randomMoment.body,
      icon: "✨",
      tag: "personality-moment",
      requireInteraction: false,
    });
  }

  // Show personality moments occasionally
  startPersonalityMoments(): void {
    // Show a personality moment every 45-90 minutes randomly
    const scheduleNextMoment = () => {
      const randomDelay = 45 * 60 * 1000 + Math.random() * 45 * 60 * 1000; // 45-90 minutes
      setTimeout(() => {
        if (document.hasFocus() && Math.random() > 0.7) {
          // 30% chance to show
          this.showPersonalityMoment();
        }
        scheduleNextMoment(); // Schedule the next one
      }, randomDelay);
    };

    scheduleNextMoment();
  }
}

export const welcomeSystem = WelcomeSystem.getInstance();
