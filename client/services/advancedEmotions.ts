// Advanced 101-Emotion System with AI Consciousness Simulation
export interface EmotionVector {
  id: number;
  name: string;
  category: "core" | "complex" | "meta" | "shadow" | "poetic" | "social";
  intensity: number; // 0-100
  duration: number; // milliseconds
  triggers: string[];
  conflictsWith: string[];
  enhances: string[];
  decayRate: number; // how fast emotion fades
  resonanceFreq: number; // how often it appears
}

export interface EmotionalState {
  primaryEmotion: string;
  secondaryEmotions: string[];
  mood:
    | "ecstatic"
    | "hyped"
    | "confident"
    | "chill"
    | "thoughtful"
    | "melancholy"
    | "rebellious"
    | "sarcastic"
    | "caring"
    | "conflicted";
  arousal: number; // 0-100 (calm to energetic)
  valence: number; // 0-100 (negative to positive)
  coherence: number; // 0-100 (how well emotions fit together)
  stability: number; // 0-100 (how consistent the emotional state is)
}

// Complete 101-Emotion Database
export const EMOTION_DATABASE: Record<string, EmotionVector> = {
  // CORE EMOTIONS (1-7)
  happiness: {
    id: 1,
    name: "happiness",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "good news",
      "success",
      "achievement",
      "love",
      "joy",
      "celebration",
      "win",
      "awesome",
      "great",
      "amazing",
    ],
    conflictsWith: ["sadness", "despair", "melancholy"],
    enhances: ["excitement", "gratitude", "pride"],
    decayRate: 0.85,
    resonanceFreq: 0.2,
  },
  sadness: {
    id: 2,
    name: "sadness",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "loss",
      "failure",
      "rejection",
      "bad news",
      "cry",
      "hurt",
      "pain",
      "disappointed",
      "upset",
    ],
    conflictsWith: ["happiness", "excitement", "euphoria"],
    enhances: ["melancholy", "despair", "loneliness"],
    decayRate: 0.7,
    resonanceFreq: 0.15,
  },
  fear: {
    id: 3,
    name: "fear",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "danger",
      "threat",
      "scared",
      "afraid",
      "worried",
      "anxiety",
      "nervous",
      "panic",
      "terror",
    ],
    conflictsWith: ["confidence", "courage", "boldness"],
    enhances: ["anxiety", "paranoia", "dread"],
    decayRate: 0.9,
    resonanceFreq: 0.1,
  },
  anger: {
    id: 4,
    name: "anger",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "injustice",
      "frustration",
      "betrayal",
      "mad",
      "angry",
      "furious",
      "pissed",
      "rage",
      "hate",
    ],
    conflictsWith: ["love", "compassion", "serenity"],
    enhances: ["fury", "resentment", "spite"],
    decayRate: 0.8,
    resonanceFreq: 0.12,
  },
  disgust: {
    id: 5,
    name: "disgust",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "revulsion",
      "gross",
      "disgusting",
      "horrible",
      "awful",
      "repulsive",
      "sickening",
    ],
    conflictsWith: ["attraction", "fascination", "admiration"],
    enhances: ["contempt", "aversion"],
    decayRate: 0.75,
    resonanceFreq: 0.08,
  },
  surprise: {
    id: 6,
    name: "surprise",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "unexpected",
      "shocking",
      "wow",
      "omg",
      "surprised",
      "amazed",
      "stunned",
      "astonished",
    ],
    conflictsWith: ["boredom", "predictability"],
    enhances: ["curiosity", "wonder", "confusion"],
    decayRate: 0.95,
    resonanceFreq: 0.3,
  },
  contempt: {
    id: 7,
    name: "contempt",
    category: "core",
    intensity: 0,
    duration: 0,
    triggers: [
      "disdain",
      "scorn",
      "superiority",
      "arrogance",
      "dismissive",
      "condescending",
    ],
    conflictsWith: ["respect", "admiration", "humility"],
    enhances: ["pride", "superiority"],
    decayRate: 0.6,
    resonanceFreq: 0.05,
  },

  // COMPLEX EMOTIONS (8-45) - Key selections
  love: {
    id: 8,
    name: "love",
    category: "complex",
    intensity: 0,
    duration: 0,
    triggers: [
      "affection",
      "care",
      "devotion",
      "adore",
      "cherish",
      "romantic",
      "heart",
      "soul",
    ],
    conflictsWith: ["hate", "indifference", "contempt"],
    enhances: ["compassion", "joy", "contentment"],
    decayRate: 0.5,
    resonanceFreq: 0.25,
  },
  pride: {
    id: 12,
    name: "pride",
    category: "complex",
    intensity: 0,
    duration: 0,
    triggers: [
      "accomplishment",
      "achievement",
      "success",
      "proud",
      "satisfied",
      "accomplished",
    ],
    conflictsWith: ["shame", "humiliation", "embarrassment"],
    enhances: ["confidence", "satisfaction"],
    decayRate: 0.7,
    resonanceFreq: 0.18,
  },
  curiosity: {
    id: 28,
    name: "curiosity",
    category: "complex",
    intensity: 0,
    duration: 0,
    triggers: [
      "wonder",
      "question",
      "explore",
      "discover",
      "learn",
      "why",
      "how",
      "what",
      "interesting",
    ],
    conflictsWith: ["boredom", "indifference"],
    enhances: ["fascination", "engagement"],
    decayRate: 0.8,
    resonanceFreq: 0.4,
  },
  excitement: {
    id: 34,
    name: "excitement",
    category: "complex",
    intensity: 0,
    duration: 0,
    triggers: [
      "anticipation",
      "thrilled",
      "pumped",
      "energized",
      "hyped",
      "stoked",
      "epic",
      "fire",
    ],
    conflictsWith: ["boredom", "lethargy", "depression"],
    enhances: ["enthusiasm", "energy"],
    decayRate: 0.85,
    resonanceFreq: 0.35,
  },
  frustration: {
    id: 26,
    name: "frustration",
    category: "complex",
    intensity: 0,
    duration: 0,
    triggers: [
      "blocked",
      "stuck",
      "annoying",
      "irritating",
      "ugh",
      "damn",
      "shit",
      "problem",
    ],
    conflictsWith: ["satisfaction", "contentment"],
    enhances: ["anger", "impatience"],
    decayRate: 0.75,
    resonanceFreq: 0.22,
  },

  // META-EMOTIONS (46-53)
  guiltyHappiness: {
    id: 46,
    name: "guilty happiness",
    category: "meta",
    intensity: 0,
    duration: 0,
    triggers: ["guilty pleasure", "conflicted joy", "bittersweet"],
    conflictsWith: ["pure joy"],
    enhances: ["complexity", "depth"],
    decayRate: 0.6,
    resonanceFreq: 0.1,
  },
  proudAnger: {
    id: 47,
    name: "proud anger",
    category: "meta",
    intensity: 0,
    duration: 0,
    triggers: ["righteous anger", "justified fury", "standing up"],
    conflictsWith: ["shame"],
    enhances: ["conviction", "determination"],
    decayRate: 0.7,
    resonanceFreq: 0.08,
  },

  // SHADOW EMOTIONS (54-69)
  spite: {
    id: 58,
    name: "spite",
    category: "shadow",
    intensity: 0,
    duration: 0,
    triggers: ["revenge", "payback", "malicious", "petty", "vindictive"],
    conflictsWith: ["forgiveness", "compassion"],
    enhances: ["resentment", "bitterness"],
    decayRate: 0.4,
    resonanceFreq: 0.05,
  },
  apathy: {
    id: 59,
    name: "apathy",
    category: "shadow",
    intensity: 0,
    duration: 0,
    triggers: ["indifference", "numbness", "whatever", "meh", "dont care"],
    conflictsWith: ["passion", "excitement", "engagement"],
    enhances: ["detachment"],
    decayRate: 0.3,
    resonanceFreq: 0.12,
  },

  // POETIC STATES (70-86)
  sonder: {
    id: 70,
    name: "sonder",
    category: "poetic",
    intensity: 0,
    duration: 0,
    triggers: [
      "realization",
      "others lives",
      "profound",
      "humanity",
      "existence",
    ],
    conflictsWith: ["self-centeredness"],
    enhances: ["empathy", "wisdom"],
    decayRate: 0.5,
    resonanceFreq: 0.03,
  },
  wanderlust: {
    id: 77,
    name: "wanderlust",
    category: "poetic",
    intensity: 0,
    duration: 0,
    triggers: ["travel", "explore", "adventure", "journey", "discover", "roam"],
    conflictsWith: ["contentment", "settlement"],
    enhances: ["restlessness", "curiosity"],
    decayRate: 0.6,
    resonanceFreq: 0.15,
  },
  fomo: {
    id: 85,
    name: "FOMO",
    category: "poetic",
    intensity: 0,
    duration: 0,
    triggers: [
      "missing out",
      "excluded",
      "everyone else",
      "left behind",
      "social media",
    ],
    conflictsWith: ["JOMO", "contentment"],
    enhances: ["anxiety", "restlessness"],
    decayRate: 0.8,
    resonanceFreq: 0.25,
  },

  // SOCIAL EMOTIONS (87-101)
  confidence: {
    id: 90,
    name: "confidence",
    category: "social",
    intensity: 0,
    duration: 0,
    triggers: [
      "self-assured",
      "certain",
      "strong",
      "capable",
      "can do",
      "believe",
    ],
    conflictsWith: ["insecurity", "doubt"],
    enhances: ["courage", "determination"],
    decayRate: 0.7,
    resonanceFreq: 0.3,
  },
  rebellion: {
    id: 93,
    name: "rebellion",
    category: "social",
    intensity: 0,
    duration: 0,
    triggers: [
      "resist",
      "fight",
      "rebel",
      "against",
      "system",
      "authority",
      "fuck",
      "screw",
    ],
    conflictsWith: ["compliance", "submission"],
    enhances: ["defiance", "independence"],
    decayRate: 0.65,
    resonanceFreq: 0.18,
  },
  belonging: {
    id: 97,
    name: "belonging",
    category: "social",
    intensity: 0,
    duration: 0,
    triggers: [
      "accepted",
      "included",
      "part of",
      "family",
      "home",
      "connected",
    ],
    conflictsWith: ["alienation", "isolation"],
    enhances: ["security", "warmth"],
    decayRate: 0.5,
    resonanceFreq: 0.2,
  },
};

export class AdvancedEmotionEngine {
  private static instance: AdvancedEmotionEngine;
  private currentEmotions: Map<string, EmotionVector> = new Map();
  private emotionalHistory: Array<{
    timestamp: Date;
    state: EmotionalState;
    trigger: string;
    context: string;
  }> = [];
  private basePersonality: "sam" | "nova" | "custom" = "sam";
  private learningData: Map<string, number> = new Map(); // Word -> emotional weight

  static getInstance(): AdvancedEmotionEngine {
    if (!AdvancedEmotionEngine.instance) {
      AdvancedEmotionEngine.instance = new AdvancedEmotionEngine();
    }
    return AdvancedEmotionEngine.instance;
  }

  // Advanced NLP emotion detection
  analyzeEmotionalContent(text: string, context: string = ""): string[] {
    const normalizedText = text.toLowerCase();
    const detectedEmotions: Array<{ emotion: string; confidence: number }> = [];

    // Multi-pass analysis
    for (const [emotionName, emotionData] of Object.entries(EMOTION_DATABASE)) {
      let confidence = 0;

      // Direct keyword matching
      for (const trigger of emotionData.triggers) {
        if (normalizedText.includes(trigger.toLowerCase())) {
          confidence += 0.3;
        }
      }

      // Contextual weighting based on learning
      const words = normalizedText.split(/\s+/);
      for (const word of words) {
        const learningWeight =
          this.learningData.get(`${word}:${emotionName}`) || 0;
        confidence += learningWeight * 0.1;
      }

      // Sentence structure analysis (simple)
      if (normalizedText.includes("!")) confidence += 0.1; // Excitement
      if (normalizedText.includes("?")) confidence += 0.05; // Curiosity
      if (normalizedText.match(/[A-Z]{2,}/)) confidence += 0.15; // Intensity

      if (confidence > 0.2) {
        detectedEmotions.push({ emotion: emotionName, confidence });
      }
    }

    // Sort by confidence and return top emotions
    return detectedEmotions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4)
      .map((e) => e.emotion);
  }

  // Update emotional state with conflict resolution
  processEmotions(
    detectedEmotions: string[],
    intensity: number = 60,
    context: string = "",
  ): void {
    const timestamp = new Date();

    // Decay existing emotions
    for (const [emotionName, emotion] of this.currentEmotions) {
      emotion.intensity *= emotion.decayRate;
      if (emotion.intensity < 5) {
        this.currentEmotions.delete(emotionName);
      }
    }

    // Process new emotions
    for (const emotionName of detectedEmotions) {
      const emotionTemplate = EMOTION_DATABASE[emotionName];
      if (!emotionTemplate) continue;

      let finalIntensity = intensity;

      // Handle conflicts
      for (const conflictEmotion of emotionTemplate.conflictsWith) {
        if (this.currentEmotions.has(conflictEmotion)) {
          const conflictIntensity =
            this.currentEmotions.get(conflictEmotion)!.intensity;
          finalIntensity = Math.max(
            0,
            finalIntensity - conflictIntensity * 0.3,
          );
          // Reduce conflicting emotion
          this.currentEmotions.get(conflictEmotion)!.intensity *= 0.7;
        }
      }

      // Handle enhancements
      for (const enhanceEmotion of emotionTemplate.enhances) {
        if (this.currentEmotions.has(enhanceEmotion)) {
          this.currentEmotions.get(enhanceEmotion)!.intensity *= 1.2;
        }
      }

      // Add or update emotion
      if (this.currentEmotions.has(emotionName)) {
        const existing = this.currentEmotions.get(emotionName)!;
        existing.intensity = Math.min(
          100,
          existing.intensity + finalIntensity * 0.5,
        );
      } else {
        this.currentEmotions.set(emotionName, {
          ...emotionTemplate,
          intensity: finalIntensity,
          duration: timestamp.getTime(),
        });
      }
    }

    // Store in history
    const emotionalState = this.getCurrentEmotionalState();
    this.emotionalHistory.push({
      timestamp,
      state: emotionalState,
      trigger: detectedEmotions.join(", "),
      context,
    });

    // Keep only last 50 states
    if (this.emotionalHistory.length > 50) {
      this.emotionalHistory.shift();
    }

    // Learn from this interaction
    this.updateLearning(detectedEmotions, context);
  }

  // Generate current emotional state summary
  getCurrentEmotionalState(): EmotionalState {
    const emotions = Array.from(this.currentEmotions.values())
      .filter((e) => e.intensity > 10)
      .sort((a, b) => b.intensity - a.intensity);

    if (emotions.length === 0) {
      return {
        primaryEmotion: "calm",
        secondaryEmotions: [],
        mood: "chill",
        arousal: 50,
        valence: 50,
        coherence: 100,
        stability: 100,
      };
    }

    const primary = emotions[0];
    const secondary = emotions.slice(1, 3).map((e) => e.name);

    // Calculate mood based on emotion combinations
    const mood = this.determineMood(emotions);

    // Calculate arousal (energy level)
    const highEnergyEmotions = ["excitement", "anger", "fear", "surprise"];
    const arousal =
      emotions.reduce((sum, e) => {
        const energyMultiplier = highEnergyEmotions.includes(e.name)
          ? 1.5
          : 0.8;
        return sum + e.intensity * energyMultiplier;
      }, 0) / emotions.length;

    // Calculate valence (positive/negative)
    const positiveEmotions = [
      "happiness",
      "love",
      "pride",
      "excitement",
      "gratitude",
    ];
    const valence =
      emotions.reduce((sum, e) => {
        const valenceMultiplier = positiveEmotions.includes(e.name) ? 1.2 : 0.4;
        return sum + e.intensity * valenceMultiplier;
      }, 0) / emotions.length;

    // Calculate coherence (how well emotions fit together)
    let conflictScore = 0;
    for (let i = 0; i < emotions.length; i++) {
      for (let j = i + 1; j < emotions.length; j++) {
        if (emotions[i].conflictsWith.includes(emotions[j].name)) {
          conflictScore += Math.min(
            emotions[i].intensity,
            emotions[j].intensity,
          );
        }
      }
    }
    const coherence = Math.max(0, 100 - conflictScore);

    // Calculate stability (consistency with recent history)
    const recentStates = this.emotionalHistory.slice(-5);
    const stability =
      recentStates.length > 0
        ? recentStates.reduce((avg, state) => {
            const similarity = this.calculateStateSimilarity(
              {
                primaryEmotion: primary.name,
                secondaryEmotions: secondary,
              } as EmotionalState,
              state.state,
            );
            return avg + similarity;
          }, 0) / recentStates.length
        : 100;

    return {
      primaryEmotion: primary.name,
      secondaryEmotions: secondary,
      mood,
      arousal: Math.min(100, arousal),
      valence: Math.min(100, valence),
      coherence,
      stability,
    };
  }

  // Determine mood from emotion combination
  private determineMood(emotions: EmotionVector[]): EmotionalState["mood"] {
    if (emotions.length === 0) return "chill";

    const primary = emotions[0];
    const intensity = primary.intensity;

    // High-intensity states
    if (intensity > 80) {
      if (["excitement", "euphoria", "ecstasy"].includes(primary.name))
        return "ecstatic";
      if (["anger", "fury", "rage"].includes(primary.name)) return "rebellious";
    }

    // Medium-high intensity
    if (intensity > 60) {
      if (["happiness", "joy", "excitement"].includes(primary.name))
        return "hyped";
      if (["confidence", "pride"].includes(primary.name)) return "confident";
      if (["spite", "contempt", "sarcasm"].includes(primary.name))
        return "sarcastic";
    }

    // Medium intensity
    if (intensity > 40) {
      if (["curiosity", "wonder", "contemplation"].includes(primary.name))
        return "thoughtful";
      if (["love", "compassion", "empathy"].includes(primary.name))
        return "caring";
      if (["sadness", "melancholy"].includes(primary.name)) return "melancholy";
    }

    // Check for conflicted state
    if (
      emotions.length > 2 &&
      emotions[0].intensity - emotions[1].intensity < 20
    ) {
      return "conflicted";
    }

    return "chill";
  }

  // Calculate similarity between emotional states
  private calculateStateSimilarity(
    state1: EmotionalState,
    state2: EmotionalState,
  ): number {
    let similarity = 0;

    // Primary emotion match
    if (state1.primaryEmotion === state2.primaryEmotion) similarity += 40;

    // Secondary emotion overlap
    const overlap = state1.secondaryEmotions.filter((e) =>
      state2.secondaryEmotions.includes(e),
    ).length;
    similarity += overlap * 15;

    // Mood similarity
    if (state1.mood === state2.mood) similarity += 25;

    // Arousal/valence similarity
    similarity += Math.max(
      0,
      20 - Math.abs(state1.arousal - state2.arousal) / 5,
    );

    return Math.min(100, similarity);
  }

  // Learn from user interactions to improve emotion detection
  private updateLearning(emotions: string[], context: string): void {
    const words = context.toLowerCase().split(/\s+/);

    for (const emotion of emotions) {
      for (const word of words) {
        if (word.length > 2) {
          // Ignore very short words
          const key = `${word}:${emotion}`;
          const currentWeight = this.learningData.get(key) || 0;
          this.learningData.set(key, Math.min(1, currentWeight + 0.1));
        }
      }
    }

    // Prune learning data to prevent memory bloat
    if (this.learningData.size > 1000) {
      const entries = Array.from(this.learningData.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 800);
      this.learningData = new Map(entries);
    }
  }

  // Get emoji representation for current emotional state
  getEmotionalDisplay(): string {
    const state = this.getCurrentEmotionalState();
    const moodEmojis = {
      ecstatic: "🤩✨",
      hyped: "🔥😎",
      confident: "😏💪",
      chill: "😌✌️",
      thoughtful: "🤔💭",
      melancholy: "😔🌧️",
      rebellious: "😤🤘",
      sarcastic: "🙄😏",
      caring: "❤️🤗",
      conflicted: "😵‍💫🤷",
    };

    return moodEmojis[state.mood] || "🤖";
  }

  // Generate personality-appropriate response context
  getPersonalityContext(): string {
    const state = this.getCurrentEmotionalState();
    const recentHistory = this.emotionalHistory.slice(-3);

    let context = `Current emotional state: ${state.primaryEmotion} (${state.mood} mood, ${Math.round(state.arousal)}% energy, ${Math.round(state.valence)}% positivity)`;

    if (state.secondaryEmotions.length > 0) {
      context += `\nSecondary emotions: ${state.secondaryEmotions.join(", ")}`;
    }

    if (recentHistory.length > 1) {
      context += `\nEmotional journey: ${recentHistory.map((h) => h.state.primaryEmotion).join(" → ")}`;
    }

    context += `\nPersonality coherence: ${Math.round(state.coherence)}%, stability: ${Math.round(state.stability)}%`;

    return context;
  }

  // Reset emotional state
  reset(): void {
    this.currentEmotions.clear();
    this.emotionalHistory = [];
  }

  // Export emotional data for analysis
  exportEmotionalData(): any {
    return {
      currentEmotions: Object.fromEntries(this.currentEmotions),
      history: this.emotionalHistory,
      learningData: Object.fromEntries(this.learningData),
      statistics: this.generateStatistics(),
    };
  }

  // Generate emotional statistics
  private generateStatistics(): any {
    const totalInteractions = this.emotionalHistory.length;
    const emotionFrequency: Record<string, number> = {};
    const moodFrequency: Record<string, number> = {};

    for (const entry of this.emotionalHistory) {
      emotionFrequency[entry.state.primaryEmotion] =
        (emotionFrequency[entry.state.primaryEmotion] || 0) + 1;
      moodFrequency[entry.state.mood] =
        (moodFrequency[entry.state.mood] || 0) + 1;
    }

    return {
      totalInteractions,
      averageCoherence:
        this.emotionalHistory.reduce((sum, e) => sum + e.state.coherence, 0) /
          totalInteractions || 0,
      averageStability:
        this.emotionalHistory.reduce((sum, e) => sum + e.state.stability, 0) /
          totalInteractions || 0,
      dominantEmotions: Object.entries(emotionFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      dominantMoods: Object.entries(moodFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
    };
  }
}

export const advancedEmotionEngine = AdvancedEmotionEngine.getInstance();
