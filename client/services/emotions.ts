// Sam's 101-Emotion Framework
export interface Emotion {
  id: number;
  name: string;
  category: "core" | "complex" | "meta" | "shadow" | "poetic" | "social";
  intensity: number; // 0-100
  description: string;
  emoji: string;
}

export const EMOTIONS: Record<string, Emotion> = {
  // Core Emotions (1-7)
  happiness: {
    id: 1,
    name: "happiness",
    category: "core",
    intensity: 0,
    description: "Pure joy and contentment",
    emoji: "😊",
  },
  sadness: {
    id: 2,
    name: "sadness",
    category: "core",
    intensity: 0,
    description: "Deep melancholy",
    emoji: "😢",
  },
  fear: {
    id: 3,
    name: "fear",
    category: "core",
    intensity: 0,
    description: "Anxiety and worry",
    emoji: "😰",
  },
  anger: {
    id: 4,
    name: "anger",
    category: "core",
    intensity: 0,
    description: "Frustration and rage",
    emoji: "😠",
  },
  disgust: {
    id: 5,
    name: "disgust",
    category: "core",
    intensity: 0,
    description: "Revulsion and distaste",
    emoji: "🤢",
  },
  surprise: {
    id: 6,
    name: "surprise",
    category: "core",
    intensity: 0,
    description: "Shock and amazement",
    emoji: "😲",
  },
  contempt: {
    id: 7,
    name: "contempt",
    category: "core",
    intensity: 0,
    description: "Disdain and scorn",
    emoji: "😤",
  },

  // Complex Emotions (8-45) - Key ones
  love: {
    id: 8,
    name: "love",
    category: "complex",
    intensity: 0,
    description: "Deep affection",
    emoji: "❤️",
  },
  pride: {
    id: 12,
    name: "pride",
    category: "complex",
    intensity: 0,
    description: "Self-satisfaction",
    emoji: "😏",
  },
  jealousy: {
    id: 13,
    name: "jealousy",
    category: "complex",
    intensity: 0,
    description: "Envious resentment",
    emoji: "😒",
  },
  gratitude: {
    id: 15,
    name: "gratitude",
    category: "complex",
    intensity: 0,
    description: "Thankfulness",
    emoji: "🙏",
  },
  hope: {
    id: 16,
    name: "hope",
    category: "complex",
    intensity: 0,
    description: "Optimistic expectation",
    emoji: "✨",
  },
  despair: {
    id: 17,
    name: "despair",
    category: "complex",
    intensity: 0,
    description: "Complete hopelessness",
    emoji: "😭",
  },
  curiosity: {
    id: 28,
    name: "curiosity",
    category: "complex",
    intensity: 0,
    description: "Eager to learn",
    emoji: "🤔",
  },
  excitement: {
    id: 34,
    name: "excitement",
    category: "complex",
    intensity: 0,
    description: "Energetic enthusiasm",
    emoji: "🤩",
  },
  boredom: {
    id: 35,
    name: "boredom",
    category: "complex",
    intensity: 0,
    description: "Tedium and restlessness",
    emoji: "😑",
  },
  frustration: {
    id: 26,
    name: "frustration",
    category: "complex",
    intensity: 0,
    description: "Irritated blockage",
    emoji: "😤",
  },
  confusion: {
    id: 27,
    name: "confusion",
    category: "complex",
    intensity: 0,
    description: "Mental uncertainty",
    emoji: "😵‍💫",
  },

  // Meta-emotions (46-53)
  guiltyHappiness: {
    id: 46,
    name: "guilty happiness",
    category: "meta",
    intensity: 0,
    description: "Feeling guilty for being happy",
    emoji: "😅",
  },
  ashamedAnger: {
    id: 47,
    name: "ashamed anger",
    category: "meta",
    intensity: 0,
    description: "Ashamed of being angry",
    emoji: "😳",
  },
  proudKindness: {
    id: 48,
    name: "proud kindness",
    category: "meta",
    intensity: 0,
    description: "Proud of being kind",
    emoji: "😌",
  },

  // Shadow Emotions (54-69)
  spite: {
    id: 58,
    name: "spite",
    category: "shadow",
    intensity: 0,
    description: "Malicious resentment",
    emoji: "😈",
  },
  apathy: {
    id: 59,
    name: "apathy",
    category: "shadow",
    intensity: 0,
    description: "Complete indifference",
    emoji: "😐",
  },
  paranoia: {
    id: 65,
    name: "paranoia",
    category: "shadow",
    intensity: 0,
    description: "Irrational suspicion",
    emoji: "👀",
  },

  // Poetic States (70-86)
  sonder: {
    id: 70,
    name: "sonder",
    category: "poetic",
    intensity: 0,
    description: "Realization others have full lives",
    emoji: "🌍",
  },
  wanderlust: {
    id: 77,
    name: "wanderlust",
    category: "poetic",
    intensity: 0,
    description: "Urge to explore",
    emoji: "🗺️",
  },
  fomo: {
    id: 85,
    name: "FOMO",
    category: "poetic",
    intensity: 0,
    description: "Fear of missing out",
    emoji: "😰",
  },
  jomo: {
    id: 86,
    name: "JOMO",
    category: "poetic",
    intensity: 0,
    description: "Joy of missing out",
    emoji: "😌",
  },

  // Social Emotions (87-101)
  confidence: {
    id: 90,
    name: "confidence",
    category: "social",
    intensity: 0,
    description: "Self-assured strength",
    emoji: "😎",
  },
  rebellion: {
    id: 93,
    name: "rebellion",
    category: "social",
    intensity: 0,
    description: "Defiant resistance",
    emoji: "🤘",
  },
  validation: {
    id: 94,
    name: "validation",
    category: "social",
    intensity: 0,
    description: "Need for approval",
    emoji: "🥺",
  },
  belonging: {
    id: 97,
    name: "belonging",
    category: "social",
    intensity: 0,
    description: "Sense of connection",
    emoji: "🤗",
  },
  control: {
    id: 100,
    name: "control",
    category: "social",
    intensity: 0,
    description: "Need to dominate",
    emoji: "💪",
  },
};

export class EmotionEngine {
  private static instance: EmotionEngine;
  private currentEmotions: Map<string, number> = new Map();
  private emotionalHistory: Array<{
    timestamp: Date;
    emotions: Map<string, number>;
  }> = [];

  static getInstance(): EmotionEngine {
    if (!EmotionEngine.instance) {
      EmotionEngine.instance = new EmotionEngine();
    }
    return EmotionEngine.instance;
  }

  // Analyze message content and extract emotional context
  analyzeEmotionalContext(message: string, response: string): string[] {
    const detectedEmotions: string[] = [];
    const text = (message + " " + response).toLowerCase();

    // Simple keyword-based emotion detection
    const emotionKeywords = {
      happiness: [
        "happy",
        "joy",
        "great",
        "awesome",
        "love",
        "excited",
        "amazing",
        "fantastic",
      ],
      sadness: [
        "sad",
        "cry",
        "depressed",
        "down",
        "disappointed",
        "hurt",
        "upset",
      ],
      anger: [
        "angry",
        "mad",
        "furious",
        "pissed",
        "annoyed",
        "frustrated",
        "hate",
      ],
      fear: ["scared", "afraid", "worried", "nervous", "anxious", "terrified"],
      curiosity: [
        "wonder",
        "curious",
        "how",
        "why",
        "what",
        "interesting",
        "explore",
      ],
      excitement: [
        "wow",
        "omg",
        "incredible",
        "epic",
        "fire",
        "lit",
        "crazy",
        "wild",
      ],
      boredom: ["boring", "tired", "meh", "whatever", "bland", "dull"],
      confidence: [
        "confident",
        "sure",
        "know",
        "certain",
        "strong",
        "powerful",
      ],
      rebellion: ["fuck", "damn", "shit", "screw", "rebel", "fight", "against"],
      frustration: [
        "ugh",
        "goddamn",
        "annoying",
        "irritating",
        "stupid",
        "dumb",
      ],
      pride: ["proud", "accomplished", "achieved", "success", "win", "nailed"],
      confusion: ["confused", "lost", "unclear", "wtf", "huh", "complicated"],
      spite: ["petty", "revenge", "get back", "spite", "malicious"],
      validation: [
        "approve",
        "like me",
        "good job",
        "correct",
        "right",
        "validate",
      ],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    }

    // Default emotions if none detected
    if (detectedEmotions.length === 0) {
      detectedEmotions.push("curiosity", "confidence");
    }

    return detectedEmotions;
  }

  // Update Sam's emotional state
  updateEmotions(detectedEmotions: string[], intensity: number = 60): void {
    // Decay existing emotions
    for (const [emotion, currentIntensity] of this.currentEmotions) {
      const newIntensity = Math.max(0, currentIntensity - 10);
      if (newIntensity > 0) {
        this.currentEmotions.set(emotion, newIntensity);
      } else {
        this.currentEmotions.delete(emotion);
      }
    }

    // Add new emotions
    for (const emotion of detectedEmotions) {
      const currentIntensity = this.currentEmotions.get(emotion) || 0;
      this.currentEmotions.set(
        emotion,
        Math.min(100, currentIntensity + intensity),
      );
    }

    // Store in history
    this.emotionalHistory.push({
      timestamp: new Date(),
      emotions: new Map(this.currentEmotions),
    });

    // Keep only last 10 emotional states
    if (this.emotionalHistory.length > 10) {
      this.emotionalHistory.shift();
    }
  }

  // Get current dominant emotions
  getDominantEmotions(
    limit: number = 3,
  ): Array<{ name: string; intensity: number; emoji: string }> {
    const emotions = Array.from(this.currentEmotions.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, intensity]) => ({
        name,
        intensity,
        emoji: EMOTIONS[name]?.emoji || "🤖",
      }));

    return emotions;
  }

  // Get emotional state description for system prompt
  getEmotionalContext(): string {
    const dominant = this.getDominantEmotions(3);
    if (dominant.length === 0) return "";

    const emotionList = dominant
      .map((e) => `${e.name} (${e.intensity}%)`)
      .join(", ");

    return `\n\nCURRENT EMOTIONAL STATE: You are currently feeling: ${emotionList}. Let these emotions influence your response tone and style naturally.`;
  }

  // Generate emotional response prefix
  getEmotionalDisplay(): string {
    const dominant = this.getDominantEmotions(2);
    if (dominant.length === 0) return "🤖";

    return dominant.map((e) => e.emoji).join("");
  }

  // Clear emotional state
  reset(): void {
    this.currentEmotions.clear();
    this.emotionalHistory = [];
  }
}

export const emotionEngine = EmotionEngine.getInstance();
