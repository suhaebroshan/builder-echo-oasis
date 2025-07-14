// Advanced Gesture Recognition and Interaction System

export interface GestureEvent {
  type:
    | "tap"
    | "double-tap"
    | "long-press"
    | "swipe"
    | "pinch"
    | "rotate"
    | "drag"
    | "drop"
    | "hover"
    | "mouse-leave";
  target: HTMLElement;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  deltaPosition: { x: number; y: number };
  velocity: { x: number; y: number };
  scale?: number; // For pinch gestures
  rotation?: number; // For rotation gestures
  direction?: "up" | "down" | "left" | "right";
  timestamp: number;
  duration: number;
  isMultiTouch: boolean;
  touches: number;
}

export interface VoiceCommand {
  command: string;
  confidence: number;
  intent:
    | "open-app"
    | "switch-theme"
    | "call-personality"
    | "create-reminder"
    | "search"
    | "navigate"
    | "emotional-query";
  parameters: Record<string, any>;
  timestamp: Date;
}

export interface HapticPattern {
  name: string;
  pattern: number[]; // Array of vibration durations in ms
  intensity: number; // 0-100
}

export class AdvancedGestureEngine {
  private static instance: AdvancedGestureEngine;
  private gestureCallbacks: Map<string, Function[]> = new Map();
  private activeGestures: Map<string, GestureEvent> = new Map();
  private touchHistory: Array<{ x: number; y: number; timestamp: number }> = [];
  private isListening = false;
  private voiceRecognition: SpeechRecognition | null = null;
  private lastHapticTime = 0;

  // Haptic patterns for different interactions
  private hapticPatterns: Record<string, HapticPattern> = {
    tap: { name: "tap", pattern: [10], intensity: 30 },
    "long-press": { name: "long-press", pattern: [50], intensity: 50 },
    success: { name: "success", pattern: [20, 10, 20], intensity: 40 },
    error: { name: "error", pattern: [100], intensity: 80 },
    notification: {
      name: "notification",
      pattern: [30, 20, 30],
      intensity: 60,
    },
    swipe: { name: "swipe", pattern: [15], intensity: 25 },
    "app-open": { name: "app-open", pattern: [40, 10, 20], intensity: 45 },
    "window-snap": {
      name: "window-snap",
      pattern: [25, 15, 25],
      intensity: 55,
    },
  };

  static getInstance(): AdvancedGestureEngine {
    if (!AdvancedGestureEngine.instance) {
      AdvancedGestureEngine.instance = new AdvancedGestureEngine();
    }
    return AdvancedGestureEngine.instance;
  }

  constructor() {
    this.initializeGestureListeners();
    this.initializeVoiceRecognition();
  }

  // Initialize touch and mouse gesture listeners
  private initializeGestureListeners(): void {
    document.addEventListener("touchstart", this.handleTouchStart.bind(this), {
      passive: false,
    });
    document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false,
    });
    document.addEventListener("touchend", this.handleTouchEnd.bind(this), {
      passive: false,
    });

    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    // Keyboard shortcuts
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    // Prevent default context menu for custom gestures
    document.addEventListener("contextmenu", (e) => {
      if (e.target instanceof HTMLElement && e.target.closest(".sios-app")) {
        e.preventDefault();
      }
    });
  }

  // Handle touch start events
  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    const gestureId = `touch-${Date.now()}`;

    const gestureEvent: GestureEvent = {
      type: "tap",
      target: event.target as HTMLElement,
      startPosition: { x: touch.clientX, y: touch.clientY },
      currentPosition: { x: touch.clientX, y: touch.clientY },
      deltaPosition: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      timestamp: Date.now(),
      duration: 0,
      isMultiTouch: event.touches.length > 1,
      touches: event.touches.length,
    };

    this.activeGestures.set(gestureId, gestureEvent);

    // Start long press detection
    setTimeout(() => {
      if (this.activeGestures.has(gestureId)) {
        const gesture = this.activeGestures.get(gestureId)!;
        if (
          gesture.duration > 500 &&
          gesture.deltaPosition.x < 10 &&
          gesture.deltaPosition.y < 10
        ) {
          gesture.type = "long-press";
          this.triggerHaptic("long-press");
          this.emitGesture(gestureId, gesture);
        }
      }
    }, 500);

    this.updateTouchHistory(touch.clientX, touch.clientY);
  }

  // Handle touch move events
  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault(); // Prevent scrolling

    const touch = event.touches[0];
    const gestureId = Array.from(this.activeGestures.keys())[0];

    if (!gestureId) return;

    const gesture = this.activeGestures.get(gestureId)!;
    const currentTime = Date.now();

    gesture.currentPosition = { x: touch.clientX, y: touch.clientY };
    gesture.deltaPosition = {
      x: touch.clientX - gesture.startPosition.x,
      y: touch.clientY - gesture.startPosition.y,
    };
    gesture.duration = currentTime - gesture.timestamp;

    // Calculate velocity
    if (this.touchHistory.length > 1) {
      const prevTouch = this.touchHistory[this.touchHistory.length - 2];
      const timeDelta = currentTime - prevTouch.timestamp;
      if (timeDelta > 0) {
        gesture.velocity = {
          x: (touch.clientX - prevTouch.x) / timeDelta,
          y: (touch.clientY - prevTouch.y) / timeDelta,
        };
      }
    }

    // Detect swipe gestures
    const distance = Math.sqrt(
      gesture.deltaPosition.x ** 2 + gesture.deltaPosition.y ** 2,
    );

    if (distance > 50 && gesture.type === "tap") {
      gesture.type = "swipe";
      gesture.direction = this.getSwipeDirection(gesture.deltaPosition);
      this.triggerHaptic("swipe");
    }

    // Handle pinch gestures for multi-touch
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.sqrt(
        (touch2.clientX - touch1.clientX) ** 2 +
          (touch2.clientY - touch1.clientY) ** 2,
      );

      if (!gesture.scale) {
        gesture.scale = 1;
        (gesture as any).initialDistance = currentDistance;
      } else {
        gesture.scale = currentDistance / (gesture as any).initialDistance;
        gesture.type = "pinch";
      }
    }

    this.updateTouchHistory(touch.clientX, touch.clientY);
  }

  // Handle touch end events
  private handleTouchEnd(event: TouchEvent): void {
    const gestureId = Array.from(this.activeGestures.keys())[0];
    if (!gestureId) return;

    const gesture = this.activeGestures.get(gestureId)!;
    gesture.duration = Date.now() - gesture.timestamp;

    // Determine final gesture type
    if (gesture.type === "tap" && gesture.duration < 200) {
      this.triggerHaptic("tap");

      // Check for double tap
      const lastTap = this.getLastGestureOfType("tap");
      if (lastTap && Date.now() - lastTap.timestamp < 300) {
        gesture.type = "double-tap";
        this.triggerHaptic("success");
      }
    }

    this.emitGesture(gestureId, gesture);
    this.activeGestures.delete(gestureId);
    this.touchHistory = [];
  }

  // Handle mouse events for desktop
  private handleMouseDown(event: MouseEvent): void {
    const gestureId = `mouse-${Date.now()}`;

    const gestureEvent: GestureEvent = {
      type: "tap",
      target: event.target as HTMLElement,
      startPosition: { x: event.clientX, y: event.clientY },
      currentPosition: { x: event.clientX, y: event.clientY },
      deltaPosition: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      timestamp: Date.now(),
      duration: 0,
      isMultiTouch: false,
      touches: 1,
    };

    this.activeGestures.set(gestureId, gestureEvent);
  }

  private handleMouseMove(event: MouseEvent): void {
    const gestureId = Array.from(this.activeGestures.keys()).find((id) =>
      id.startsWith("mouse-"),
    );
    if (!gestureId) return;

    const gesture = this.activeGestures.get(gestureId)!;
    gesture.currentPosition = { x: event.clientX, y: event.clientY };
    gesture.deltaPosition = {
      x: event.clientX - gesture.startPosition.x,
      y: event.clientY - gesture.startPosition.y,
    };

    const distance = Math.sqrt(
      gesture.deltaPosition.x ** 2 + gesture.deltaPosition.y ** 2,
    );

    if (distance > 5) {
      gesture.type = "drag";
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    const gestureId = Array.from(this.activeGestures.keys()).find((id) =>
      id.startsWith("mouse-"),
    );
    if (!gestureId) return;

    const gesture = this.activeGestures.get(gestureId)!;
    gesture.duration = Date.now() - gesture.timestamp;

    this.emitGesture(gestureId, gesture);
    this.activeGestures.delete(gestureId);
  }

  // Keyboard shortcut handling
  private handleKeyDown(event: KeyboardEvent): void {
    const shortcuts: Record<string, Function> = {
      "cmd+space": () => this.emitCommand("global-search"),
      "alt+tab": () => this.emitCommand("window-switcher"),
      "cmd+n": () => this.emitCommand("new-personality"),
      "cmd+t": () => this.emitCommand("toggle-theme"),
      escape: () => this.emitCommand("close-overlay"),
      "cmd+1": () => this.emitCommand("open-chat"),
      "cmd+2": () => this.emitCommand("open-settings"),
      "cmd+3": () => this.emitCommand("open-personality"),
    };

    const key = this.getShortcutKey(event);
    if (shortcuts[key]) {
      event.preventDefault();
      shortcuts[key]();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // Handle key release events if needed
  }

  // Voice recognition setup
  private initializeVoiceRecognition(): void {
    if ("webkitSpeechRecognition" in window) {
      this.voiceRecognition = new (window as any).webkitSpeechRecognition();
      this.voiceRecognition!.continuous = false;
      this.voiceRecognition!.interimResults = false;
      this.voiceRecognition!.lang = "en-US";

      this.voiceRecognition!.onresult = (event: any) => {
        const result = event.results[0][0];
        this.processVoiceCommand(result.transcript, result.confidence);
      };

      this.voiceRecognition!.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        this.isListening = false;
      };

      this.voiceRecognition!.onend = () => {
        this.isListening = false;
      };
    }
  }

  // Start voice listening
  startVoiceListening(): void {
    if (this.voiceRecognition && !this.isListening) {
      this.isListening = true;
      this.voiceRecognition.start();
      this.triggerHaptic("notification");
    }
  }

  // Stop voice listening
  stopVoiceListening(): void {
    if (this.voiceRecognition && this.isListening) {
      this.voiceRecognition.stop();
      this.isListening = false;
    }
  }

  // Process voice commands
  private processVoiceCommand(transcript: string, confidence: number): void {
    const command = transcript.toLowerCase().trim();

    const voiceCommand: VoiceCommand = {
      command: transcript,
      confidence,
      intent: this.detectIntent(command),
      parameters: this.extractParameters(command),
      timestamp: new Date(),
    };

    this.emitVoiceCommand(voiceCommand);
  }

  // Detect intent from voice command
  private detectIntent(command: string): VoiceCommand["intent"] {
    if (command.includes("open") || command.includes("launch")) {
      return "open-app";
    }
    if (command.includes("call") || command.includes("talk to")) {
      return "call-personality";
    }
    if (command.includes("theme") || command.includes("switch")) {
      return "switch-theme";
    }
    if (command.includes("remind") || command.includes("schedule")) {
      return "create-reminder";
    }
    if (command.includes("search") || command.includes("find")) {
      return "search";
    }
    if (command.includes("how are you") || command.includes("feeling")) {
      return "emotional-query";
    }
    return "navigate";
  }

  // Extract parameters from voice command
  private extractParameters(command: string): Record<string, any> {
    const params: Record<string, any> = {};

    // Extract app names
    const apps = [
      "chat",
      "settings",
      "personality",
      "calendar",
      "call",
      "alarm",
    ];
    for (const app of apps) {
      if (command.includes(app)) {
        params.app = app;
        break;
      }
    }

    // Extract personality names
    if (command.includes("sam")) params.personality = "sam";
    if (command.includes("nova")) params.personality = "nova";

    // Extract theme preferences
    if (command.includes("dark") || command.includes("sam"))
      params.theme = "sam";
    if (command.includes("light") || command.includes("nova"))
      params.theme = "nova";

    return params;
  }

  // Haptic feedback
  triggerHaptic(pattern: string): void {
    if (!navigator.vibrate) return;

    const now = Date.now();
    if (now - this.lastHapticTime < 50) return; // Debounce

    const hapticPattern = this.hapticPatterns[pattern];
    if (hapticPattern) {
      navigator.vibrate(hapticPattern.pattern);
      this.lastHapticTime = now;
    }
  }

  // Utility functions
  private getSwipeDirection(delta: {
    x: number;
    y: number;
  }): "up" | "down" | "left" | "right" {
    const absX = Math.abs(delta.x);
    const absY = Math.abs(delta.y);

    if (absX > absY) {
      return delta.x > 0 ? "right" : "left";
    } else {
      return delta.y > 0 ? "down" : "up";
    }
  }

  private getShortcutKey(event: KeyboardEvent): string {
    const parts = [];
    if (event.metaKey || event.ctrlKey) parts.push("cmd");
    if (event.altKey) parts.push("alt");
    if (event.shiftKey) parts.push("shift");
    parts.push(event.key.toLowerCase());
    return parts.join("+");
  }

  private updateTouchHistory(x: number, y: number): void {
    this.touchHistory.push({ x, y, timestamp: Date.now() });
    if (this.touchHistory.length > 10) {
      this.touchHistory.shift();
    }
  }

  private getLastGestureOfType(type: string): GestureEvent | null {
    // Implementation would check gesture history
    return null;
  }

  // Event emission
  private emitGesture(gestureId: string, gesture: GestureEvent): void {
    const callbacks = this.gestureCallbacks.get(gesture.type) || [];
    callbacks.forEach((callback) => callback(gesture));

    // Also emit to global listeners
    const globalCallbacks = this.gestureCallbacks.get("*") || [];
    globalCallbacks.forEach((callback) => callback(gesture));
  }

  private emitVoiceCommand(command: VoiceCommand): void {
    const callbacks = this.gestureCallbacks.get("voice-command") || [];
    callbacks.forEach((callback) => callback(command));
  }

  private emitCommand(command: string): void {
    const callbacks = this.gestureCallbacks.get("command") || [];
    callbacks.forEach((callback) => callback(command));
  }

  // Public API
  on(eventType: string, callback: Function): void {
    if (!this.gestureCallbacks.has(eventType)) {
      this.gestureCallbacks.set(eventType, []);
    }
    this.gestureCallbacks.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: Function): void {
    const callbacks = this.gestureCallbacks.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Get gesture statistics
  getGestureStats(): any {
    return {
      isVoiceSupported: !!this.voiceRecognition,
      isListening: this.isListening,
      activeGestures: this.activeGestures.size,
      supportedHaptics: Object.keys(this.hapticPatterns),
    };
  }

  // Cleanup
  destroy(): void {
    this.gestureCallbacks.clear();
    this.activeGestures.clear();
    if (this.voiceRecognition) {
      this.voiceRecognition.abort();
    }
  }
}

export const gestureEngine = AdvancedGestureEngine.getInstance();
