import { create } from "zustand";

export type AppId =
  | "chat"
  | "settings"
  | "personality"
  | "memory"
  | "calendar"
  | "call";

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
}

const defaultApps: Record<AppId, App> = {
  chat: {
    id: "chat",
    name: "Chat",
    icon: "💬",
    isOpen: false,
    zIndex: 1,
    position: { x: 100, y: 100 },
  },
  settings: {
    id: "settings",
    name: "Settings",
    icon: "🎛",
    isOpen: false,
    zIndex: 1,
    position: { x: 150, y: 150 },
  },
  personality: {
    id: "personality",
    name: "Personality Manager",
    icon: "🎭",
    isOpen: false,
    zIndex: 1,
    position: { x: 200, y: 200 },
  },
  memory: {
    id: "memory",
    name: "Memory Viewer",
    icon: "🧠",
    isOpen: false,
    zIndex: 1,
    position: { x: 250, y: 250 },
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    icon: "📆",
    isOpen: false,
    zIndex: 1,
    position: { x: 300, y: 300 },
  },
  call: {
    id: "call",
    name: "Call AI",
    icon: "📞",
    isOpen: false,
    zIndex: 1,
    position: { x: 350, y: 350 },
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
      updatedApps[key as AppId].isOpen = false;
    });

    set({ apps: updatedApps });
  },

  getOpenApps: () => {
    const { apps } = get();
    return Object.values(apps).filter((app) => app.isOpen);
  },
}));
