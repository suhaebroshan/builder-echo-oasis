interface ConversationMemory {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  emotions: string[];
  personality: string;
  importance: number; // 1-10 scale
  context: string;
  tags: string[];
}

interface UserProfile {
  name: string;
  preferences: Record<string, any>;
  habits: string[];
  personalityTraits: string[];
  interests: string[];
  goals: string[];
  relationships: Record<string, string>;
  mood_history: { date: string; mood: string; emotions: string[] }[];
  communication_style: string;
  pronouns: string;
  timezone: string;
  last_active: Date;
}

interface LongTermMemory {
  facts: Record<string, { value: any; confidence: number; last_updated: Date }>;
  patterns: Record<
    string,
    { pattern: string; frequency: number; examples: string[] }
  >;
  important_events: { date: Date; event: string; emotional_impact: number }[];
  relationship_dynamics: Record<
    string,
    { strength: number; nature: string; notes: string[] }
  >;
}

export class MemorySystem {
  private static instance: MemorySystem;
  private conversations: ConversationMemory[] = [];
  private userProfile: UserProfile;
  private longTermMemory: LongTermMemory;
  private readonly STORAGE_KEY = "sios_memory_system";
  private readonly USER_PROFILE_KEY = "sios_user_profile";
  private readonly LONG_TERM_KEY = "sios_long_term_memory";

  constructor() {
    this.loadFromStorage();
  }

  static getInstance(): MemorySystem {
    if (!MemorySystem.instance) {
      MemorySystem.instance = new MemorySystem();
    }
    return MemorySystem.instance;
  }

  // Conversation Memory Management
  addConversation(
    userMessage: string,
    aiResponse: string,
    emotions: string[],
    personality: string,
    context: string = "",
  ): void {
    const importance = this.calculateImportance(
      userMessage,
      aiResponse,
      emotions,
    );

    const memory: ConversationMemory = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      userMessage,
      aiResponse,
      emotions,
      personality,
      importance,
      context,
      tags: this.extractTags(userMessage + " " + aiResponse),
    };

    this.conversations.push(memory);

    // Keep only last 1000 conversations, prioritize high-importance ones
    if (this.conversations.length > 1000) {
      this.conversations.sort((a, b) => b.importance - a.importance);
      this.conversations = this.conversations.slice(0, 1000);
    }

    this.updateLongTermMemory(memory);
    this.saveToStorage();
  }

  getRecentConversations(count: number = 10): ConversationMemory[] {
    return this.conversations
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, count);
  }

  searchConversations(query: string, limit: number = 5): ConversationMemory[] {
    const lowerQuery = query.toLowerCase();
    return this.conversations
      .filter(
        (conv) =>
          conv.userMessage.toLowerCase().includes(lowerQuery) ||
          conv.aiResponse.toLowerCase().includes(lowerQuery) ||
          conv.tags.some((tag) => tag.includes(lowerQuery)),
      )
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  // User Profile Management
  updateUserProfile(updates: Partial<UserProfile>): void {
    this.userProfile = { ...this.userProfile, ...updates };
    this.userProfile.last_active = new Date();
    localStorage.setItem(
      this.USER_PROFILE_KEY,
      JSON.stringify(this.userProfile),
    );
  }

  getUserProfile(): UserProfile {
    return this.userProfile;
  }

  addUserPreference(key: string, value: any): void {
    this.userProfile.preferences[key] = value;
    this.updateUserProfile({});
  }

  addUserHabit(habit: string): void {
    if (!this.userProfile.habits.includes(habit)) {
      this.userProfile.habits.push(habit);
      this.updateUserProfile({});
    }
  }

  recordMood(mood: string, emotions: string[]): void {
    const today = new Date().toISOString().split("T")[0];
    const existingIndex = this.userProfile.mood_history.findIndex(
      (m) => m.date === today,
    );

    if (existingIndex >= 0) {
      this.userProfile.mood_history[existingIndex] = {
        date: today,
        mood,
        emotions,
      };
    } else {
      this.userProfile.mood_history.push({ date: today, mood, emotions });
    }

    // Keep only last 365 days
    if (this.userProfile.mood_history.length > 365) {
      this.userProfile.mood_history = this.userProfile.mood_history.slice(-365);
    }

    this.updateUserProfile({});
  }

  // Context Generation for AI
  generateContextPrompt(): string {
    const recent = this.getRecentConversations(5);
    const profile = this.userProfile;
    const facts = Object.entries(this.longTermMemory.facts)
      .sort(([, a], [, b]) => b.confidence - a.confidence)
      .slice(0, 10);

    let context = "\n--- MEMORY CONTEXT ---\n";

    if (profile.name) {
      context += `User's name: ${profile.name}\n`;
    }

    if (profile.pronouns) {
      context += `Pronouns: ${profile.pronouns}\n`;
    }

    if (profile.communication_style) {
      context += `Communication style: ${profile.communication_style}\n`;
    }

    if (profile.interests.length > 0) {
      context += `Interests: ${profile.interests.join(", ")}\n`;
    }

    if (profile.goals.length > 0) {
      context += `Goals: ${profile.goals.join(", ")}\n`;
    }

    if (facts.length > 0) {
      context += "\nImportant facts about user:\n";
      facts.forEach(([fact, data]) => {
        context += `- ${fact}: ${data.value}\n`;
      });
    }

    if (recent.length > 0) {
      context += "\nRecent conversation context:\n";
      recent.forEach((conv) => {
        context += `User: ${conv.userMessage}\nSam: ${conv.aiResponse}\n---\n`;
      });
    }

    if (profile.mood_history.length > 0) {
      const recentMood = profile.mood_history[profile.mood_history.length - 1];
      context += `\nRecent mood: ${recentMood.mood} (${recentMood.emotions.join(", ")})\n`;
    }

    context += "--- END MEMORY CONTEXT ---\n";
    return context;
  }

  // Long-term Memory Processing
  private updateLongTermMemory(conversation: ConversationMemory): void {
    // Extract facts from conversation
    this.extractFacts(conversation);

    // Update patterns
    this.updatePatterns(conversation);

    // Record important events
    if (conversation.importance >= 8) {
      this.longTermMemory.important_events.push({
        date: conversation.timestamp,
        event: `${conversation.userMessage} -> ${conversation.aiResponse}`,
        emotional_impact: conversation.importance,
      });
    }

    localStorage.setItem(
      this.LONG_TERM_KEY,
      JSON.stringify(this.longTermMemory),
    );
  }

  private extractFacts(conversation: ConversationMemory): void {
    const userMessage = conversation.userMessage.toLowerCase();

    // Simple fact extraction patterns
    const patterns = [
      /my name is (\w+)/i,
      /i (like|love|enjoy) (.+)/i,
      /i (hate|dislike) (.+)/i,
      /i work as (?:a |an )?(.+)/i,
      /i live in (.+)/i,
      /i'm (\d+) years old/i,
      /my birthday is (.+)/i,
    ];

    patterns.forEach((pattern) => {
      const match = userMessage.match(pattern);
      if (match) {
        let key = "";
        let value = "";

        if (pattern.source.includes("name")) {
          key = "name";
          value = match[1];
        } else if (pattern.source.includes("like|love|enjoy")) {
          key = `likes_${match[2].replace(/\s+/g, "_")}`;
          value = true;
        } else if (pattern.source.includes("hate|dislike")) {
          key = `dislikes_${match[2].replace(/\s+/g, "_")}`;
          value = true;
        } else if (pattern.source.includes("work")) {
          key = "job";
          value = match[1];
        } else if (pattern.source.includes("live")) {
          key = "location";
          value = match[1];
        } else if (pattern.source.includes("age")) {
          key = "age";
          value = parseInt(match[1]);
        } else if (pattern.source.includes("birthday")) {
          key = "birthday";
          value = match[1];
        }

        if (key && value) {
          this.longTermMemory.facts[key] = {
            value,
            confidence: 0.8,
            last_updated: new Date(),
          };
        }
      }
    });
  }

  private updatePatterns(conversation: ConversationMemory): void {
    // Analyze communication patterns, time patterns, etc.
    const hour = conversation.timestamp.getHours();
    const timePattern =
      hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

    if (!this.longTermMemory.patterns[`active_${timePattern}`]) {
      this.longTermMemory.patterns[`active_${timePattern}`] = {
        pattern: `User is active during ${timePattern}`,
        frequency: 0,
        examples: [],
      };
    }

    this.longTermMemory.patterns[`active_${timePattern}`].frequency++;

    if (
      this.longTermMemory.patterns[`active_${timePattern}`].examples.length < 5
    ) {
      this.longTermMemory.patterns[`active_${timePattern}`].examples.push(
        `${conversation.timestamp.toLocaleString()}: ${conversation.userMessage.slice(0, 50)}...`,
      );
    }
  }

  private calculateImportance(
    userMessage: string,
    aiResponse: string,
    emotions: string[],
  ): number {
    let importance = 5; // Base importance

    // High importance keywords
    const highImportanceWords = [
      "name",
      "birthday",
      "family",
      "love",
      "hate",
      "job",
      "work",
      "goal",
      "dream",
      "problem",
      "help",
    ];
    const hasHighImportance = highImportanceWords.some(
      (word) =>
        userMessage.toLowerCase().includes(word) ||
        aiResponse.toLowerCase().includes(word),
    );

    if (hasHighImportance) importance += 2;

    // Strong emotions increase importance
    const strongEmotions = ["😭", "😍", "😡", "🤬", "😰", "🥺", "😤", "🔥"];
    if (emotions.some((emotion) => strongEmotions.includes(emotion))) {
      importance += 1;
    }

    // Length and complexity
    if (userMessage.length > 100) importance += 1;
    if (aiResponse.length > 200) importance += 1;

    return Math.min(importance, 10);
  }

  private extractTags(text: string): string[] {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "can",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "her",
      "us",
      "them",
    ]);

    return words
      .filter((word) => word.length > 2 && !commonWords.has(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 10); // Limit to 10 tags
  }

  private loadFromStorage(): void {
    // Load conversations
    const savedConversations = localStorage.getItem(this.STORAGE_KEY);
    if (savedConversations) {
      try {
        this.conversations = JSON.parse(savedConversations).map(
          (conv: any) => ({
            ...conv,
            timestamp: new Date(conv.timestamp),
          }),
        );
      } catch (error) {
        console.error("Failed to load conversations:", error);
        this.conversations = [];
      }
    }

    // Load user profile
    const savedProfile = localStorage.getItem(this.USER_PROFILE_KEY);
    if (savedProfile) {
      try {
        this.userProfile = JSON.parse(savedProfile);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        this.userProfile = this.getDefaultUserProfile();
      }
    } else {
      this.userProfile = this.getDefaultUserProfile();
    }

    // Load long-term memory
    const savedLongTerm = localStorage.getItem(this.LONG_TERM_KEY);
    if (savedLongTerm) {
      try {
        this.longTermMemory = JSON.parse(savedLongTerm);
      } catch (error) {
        console.error("Failed to load long-term memory:", error);
        this.longTermMemory = this.getDefaultLongTermMemory();
      }
    } else {
      this.longTermMemory = this.getDefaultLongTermMemory();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.conversations),
      );
    } catch (error) {
      console.error("Failed to save conversations:", error);
    }
  }

  private getDefaultUserProfile(): UserProfile {
    return {
      name: "",
      preferences: {},
      habits: [],
      personalityTraits: [],
      interests: [],
      goals: [],
      relationships: {},
      mood_history: [],
      communication_style: "casual",
      pronouns: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      last_active: new Date(),
    };
  }

  private getDefaultLongTermMemory(): LongTermMemory {
    return {
      facts: {},
      patterns: {},
      important_events: [],
      relationship_dynamics: {},
    };
  }

  // Export/Import functionality
  exportMemoryData(): string {
    return JSON.stringify(
      {
        conversations: this.conversations,
        userProfile: this.userProfile,
        longTermMemory: this.longTermMemory,
        exportDate: new Date(),
      },
      null,
      2,
    );
  }

  importMemoryData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.conversations) {
        this.conversations = data.conversations.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
        }));
      }

      if (data.userProfile) {
        this.userProfile = data.userProfile;
      }

      if (data.longTermMemory) {
        this.longTermMemory = data.longTermMemory;
      }

      this.saveToStorage();
      localStorage.setItem(
        this.USER_PROFILE_KEY,
        JSON.stringify(this.userProfile),
      );
      localStorage.setItem(
        this.LONG_TERM_KEY,
        JSON.stringify(this.longTermMemory),
      );

      return true;
    } catch (error) {
      console.error("Failed to import memory data:", error);
      return false;
    }
  }

  // Clear all memory (with confirmation)
  clearAllMemory(): void {
    this.conversations = [];
    this.userProfile = this.getDefaultUserProfile();
    this.longTermMemory = this.getDefaultLongTermMemory();

    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_PROFILE_KEY);
    localStorage.removeItem(this.LONG_TERM_KEY);
  }

  // Analytics
  getMemoryStats() {
    return {
      totalConversations: this.conversations.length,
      oldestConversation:
        this.conversations.length > 0
          ? Math.min(
              ...this.conversations.map((c) => new Date(c.timestamp).getTime()),
            )
          : null,
      averageImportance:
        this.conversations.length > 0
          ? this.conversations.reduce((sum, c) => sum + c.importance, 0) /
            this.conversations.length
          : 0,
      totalFacts: Object.keys(this.longTermMemory.facts).length,
      totalPatterns: Object.keys(this.longTermMemory.patterns).length,
      moodEntries: this.userProfile.mood_history.length,
      userInterests: this.userProfile.interests.length,
    };
  }
}

export const memorySystem = MemorySystem.getInstance();
