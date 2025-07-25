import { create } from "zustand";

export type AppId =
  | "chat"
  | "settings"
  | "personality"
  | "memory"
  | "calendar"
  | "call"
  | "ai-assistant"
  | "alarm"
  | string; // Allow custom personality IDs

export interface App {
  id: AppId;
  name: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type?: "system" | "personality";
  phoneNumber?: string;
  description?: string;
}

interface AppStore {
  apps: Record<AppId, App>;
  highestZIndex: number;
  openApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  minimizeApp: (appId: AppId) => void;
  maximizeApp: (appId: AppId) => void;
  restoreApp: (appId: AppId) => void;
  bringToFront: (appId: AppId) => void;
  minimizeAll: () => void;
  getOpenApps: () => App[];
  getMinimizedApps: () => App[];
  addPersonality: (
    personality: Omit<App, "isOpen" | "isMinimized" | "isMaximized" | "zIndex">,
  ) => void;
  removePersonality: (appId: AppId) => void;
  getPersonalities: () => App[];
}

const defaultApps: Record<AppId, App> = {
  chat: {
    id: "chat",
    name: "Chat",
    icon: "💬",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 100, y: 100 },
    size: { width: 800, height: 600 },
    type: "system",
  },
  settings: {
    id: "settings",
    name: "Settings",
    icon: "🎛",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 150, y: 150 },
    size: { width: 700, height: 500 },
    type: "system",
  },
  personality: {
    id: "personality",
    name: "Personality Manager",
    icon: "🎭",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 200, y: 200 },
    size: { width: 600, height: 500 },
    type: "system",
  },
  memory: {
    id: "memory",
    name: "Memory Viewer",
    icon: "🧠",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 250, y: 250 },
    size: { width: 700, height: 600 },
    type: "system",
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    icon: "📆",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 300, y: 300 },
    size: { width: 600, height: 500 },
    type: "system",
  },
  call: {
    id: "call",
    name: "Call AI",
    icon: "📞",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 350, y: 350 },
    size: { width: 500, height: 600 },
    type: "system",
  },
  "ai-assistant": {
    id: "ai-assistant",
    name: "AI Assistant",
    icon: "🤖",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 400, y: 400 },
    size: { width: 900, height: 700 },
    type: "system",
  },
  alarm: {
    id: "alarm",
    name: "Alarms",
    icon: "⏰",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 500, y: 200 },
    size: { width: 600, height: 700 },
    type: "system",
  },
  // Add default personality apps
  sam: {
    id: "sam",
    name: "Sam",
    icon: "🎨",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 400, y: 100 },
    size: { width: 800, height: 600 },
    type: "personality",
    phoneNumber: "001",
    description: "Creative and edgy AI assistant with urban vibes",
  },
  nova: {
    id: "nova",
    name: "Nova",
    icon: "🌟",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 450, y: 150 },
    size: { width: 800, height: 600 },
    type: "personality",
    phoneNumber: "002",
    description:
      "Professional and analytical AI assistant with holographic aesthetics",
  },
};

export const useAppStore = create<AppStore>((set, get) => ({
  apps: defaultApps,
  highestZIndex: 1,

  openApp: (appId: AppId) => {
    const { apps, highestZIndex } = get();
    const newZIndex = highestZIndex + 1;

    set({
      apps: {
        ...apps,
        [appId]: {
          ...apps[appId],
          isOpen: true,
          isMinimized: false,
          zIndex: newZIndex,
        },
      },
      highestZIndex: newZIndex,
    });
  },

  closeApp: (appId: AppId) => {
    const { apps } = get();
    set({
      apps: {
        ...apps,
        [appId]: {
          ...apps[appId],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      },
    });
  },

  minimizeApp: (appId: AppId) => {
    const { apps } = get();
    set({
      apps: {
        ...apps,
        [appId]: {
          ...apps[appId],
          isMinimized: true,
        },
      },
    });
  },

  maximizeApp: (appId: AppId) => {
    const { apps } = get();
    set({
      apps: {
        ...apps,
        [appId]: {
          ...apps[appId],
          isMaximized: !apps[appId].isMaximized,
        },
      },
    });
  },

  restoreApp: (appId: AppId) => {
    const { apps } = get();
    set({
      apps: {
        ...apps,
        [appId]: {
          ...apps[appId],
          isMinimized: false,
          isMaximized: false,
        },
      },
    });
  },

  bringToFront: (appId: AppId) => {
    const { apps, highestZIndex } = get();
    const newZIndex = highestZIndex + 1;

    set({
      apps: {
        ...apps,
        [appId]: {
          ...apps[appId],
          zIndex: newZIndex,
        },
      },
      highestZIndex: newZIndex,
    });
  },

  minimizeAll: () => {
    const { apps } = get();
    const updatedApps = { ...apps };

    Object.keys(updatedApps).forEach((key) => {
      if (updatedApps[key as AppId].isOpen) {
        updatedApps[key as AppId].isMinimized = true;
      }
    });

    set({ apps: updatedApps });
  },

  getOpenApps: () => {
    const { apps } = get();
    return Object.values(apps).filter((app) => app.isOpen && !app.isMinimized);
  },

  getMinimizedApps: () => {
    const { apps } = get();
    return Object.values(apps).filter((app) => app.isOpen && app.isMinimized);
  },

  addPersonality: (personality) => {
    const { apps } = get();
    set({
      apps: {
        ...apps,
        [personality.id]: {
          ...personality,
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          zIndex: 1,
          type: "personality",
        },
      },
    });
  },

  removePersonality: (appId) => {
    const { apps } = get();
    const { [appId]: removed, ...remainingApps } = apps;
    set({ apps: remainingApps });
  },

  getPersonalities: () => {
    const { apps } = get();
    return Object.values(apps).filter((app) => app.type === "personality");
  },
}));
