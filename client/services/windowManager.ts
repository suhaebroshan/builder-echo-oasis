// Advanced Window Management System with Snap Zones and Multi-Monitor Support

export interface WindowState {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  maximized: boolean;
  fullscreen: boolean;
  zIndex: number;
  snapZone: SnapZone | null;
  lastPosition: { x: number; y: number }; // For restore
  lastSize: { width: number; height: number }; // For restore
  isSnapped: boolean;
  isDragging: boolean;
  isResizing: boolean;
  opacity: number;
  blur: number;
  scale: number;
}

export type SnapZone =
  | "left-half"
  | "right-half"
  | "top-half"
  | "bottom-half"
  | "top-left-quarter"
  | "top-right-quarter"
  | "bottom-left-quarter"
  | "bottom-right-quarter"
  | "center"
  | "maximized";

export interface SnapGuide {
  zone: SnapZone;
  rect: { x: number; y: number; width: number; height: number };
  active: boolean;
  magnetStrength: number;
}

export interface Monitor {
  id: string;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  scaleFactor: number;
  isPrimary: boolean;
}

export class AdvancedWindowManager {
  private static instance: AdvancedWindowManager;
  private windows: Map<string, WindowState> = new Map();
  private snapGuides: SnapGuide[] = [];
  private monitors: Monitor[] = [];
  private dragThreshold = 10;
  private snapThreshold = 20;
  private highestZIndex = 1000;
  private animationDuration = 300;

  // Window focus history for Alt+Tab functionality
  private focusHistory: string[] = [];
  private showingSnapGuides = false;

  static getInstance(): AdvancedWindowManager {
    if (!AdvancedWindowManager.instance) {
      AdvancedWindowManager.instance = new AdvancedWindowManager();
    }
    return AdvancedWindowManager.instance;
  }

  constructor() {
    this.initializeMonitors();
    this.setupSnapGuides();
    this.setupEventListeners();
  }

  // Initialize monitor detection
  private initializeMonitors(): void {
    // Primary monitor (browser viewport)
    this.monitors = [
      {
        id: "primary",
        bounds: {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        workArea: {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 100,
        }, // Account for taskbar
        scaleFactor: window.devicePixelRatio || 1,
        isPrimary: true,
      },
    ];

    // Update on resize
    window.addEventListener("resize", () => {
      this.monitors[0].bounds.width = window.innerWidth;
      this.monitors[0].bounds.height = window.innerHeight;
      this.monitors[0].workArea.width = window.innerWidth;
      this.monitors[0].workArea.height = window.innerHeight - 100;
      this.setupSnapGuides();
    });
  }

  // Setup snap guide zones
  private setupSnapGuides(): void {
    const monitor = this.monitors[0]; // Primary monitor
    const { workArea } = monitor;

    this.snapGuides = [
      // Half screen zones
      {
        zone: "left-half",
        rect: {
          x: workArea.x,
          y: workArea.y,
          width: workArea.width / 2,
          height: workArea.height,
        },
        active: false,
        magnetStrength: 0.8,
      },
      {
        zone: "right-half",
        rect: {
          x: workArea.x + workArea.width / 2,
          y: workArea.y,
          width: workArea.width / 2,
          height: workArea.height,
        },
        active: false,
        magnetStrength: 0.8,
      },
      {
        zone: "top-half",
        rect: {
          x: workArea.x,
          y: workArea.y,
          width: workArea.width,
          height: workArea.height / 2,
        },
        active: false,
        magnetStrength: 0.6,
      },
      {
        zone: "bottom-half",
        rect: {
          x: workArea.x,
          y: workArea.y + workArea.height / 2,
          width: workArea.width,
          height: workArea.height / 2,
        },
        active: false,
        magnetStrength: 0.6,
      },

      // Quarter screen zones
      {
        zone: "top-left-quarter",
        rect: {
          x: workArea.x,
          y: workArea.y,
          width: workArea.width / 2,
          height: workArea.height / 2,
        },
        active: false,
        magnetStrength: 0.7,
      },
      {
        zone: "top-right-quarter",
        rect: {
          x: workArea.x + workArea.width / 2,
          y: workArea.y,
          width: workArea.width / 2,
          height: workArea.height / 2,
        },
        active: false,
        magnetStrength: 0.7,
      },
      {
        zone: "bottom-left-quarter",
        rect: {
          x: workArea.x,
          y: workArea.y + workArea.height / 2,
          width: workArea.width / 2,
          height: workArea.height / 2,
        },
        active: false,
        magnetStrength: 0.7,
      },
      {
        zone: "bottom-right-quarter",
        rect: {
          x: workArea.x + workArea.width / 2,
          y: workArea.y + workArea.height / 2,
          width: workArea.width / 2,
          height: workArea.height / 2,
        },
        active: false,
        magnetStrength: 0.7,
      },

      // Center and maximized
      {
        zone: "center",
        rect: {
          x: workArea.x + workArea.width * 0.125,
          y: workArea.y + workArea.height * 0.125,
          width: workArea.width * 0.75,
          height: workArea.height * 0.75,
        },
        active: false,
        magnetStrength: 0.5,
      },
      {
        zone: "maximized",
        rect: {
          x: workArea.x,
          y: workArea.y,
          width: workArea.width,
          height: workArea.height,
        },
        active: false,
        magnetStrength: 0.9,
      },
    ];
  }

  // Register a new window
  registerWindow(
    id: string,
    initialPosition: { x: number; y: number },
    initialSize: { width: number; height: number },
  ): WindowState {
    const windowState: WindowState = {
      id,
      position: { ...initialPosition },
      size: { ...initialSize },
      minimized: false,
      maximized: false,
      fullscreen: false,
      zIndex: ++this.highestZIndex,
      snapZone: null,
      lastPosition: { ...initialPosition },
      lastSize: { ...initialSize },
      isSnapped: false,
      isDragging: false,
      isResizing: false,
      opacity: 1,
      blur: 0,
      scale: 1,
    };

    this.windows.set(id, windowState);
    this.focusWindow(id);
    return windowState;
  }

  // Start window drag
  startDrag(windowId: string, startPosition: { x: number; y: number }): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.isDragging = true;
    window.isSnapped = false;
    this.showSnapGuides(true);
    this.focusWindow(windowId);

    // Store original position for potential restoration
    if (!window.isSnapped) {
      window.lastPosition = { ...window.position };
      window.lastSize = { ...window.size };
    }
  }

  // Update window position during drag
  updateDrag(
    windowId: string,
    currentPosition: { x: number; y: number },
    delta: { x: number; y: number },
  ): void {
    const window = this.windows.get(windowId);
    if (!window || !window.isDragging) return;

    // Update position
    window.position.x += delta.x;
    window.position.y += delta.y;

    // Check for snap zones
    const activeZone = this.checkSnapZones(currentPosition);

    // Update snap guide visibility
    this.snapGuides.forEach((guide) => {
      guide.active = guide.zone === activeZone;
    });

    // Provide haptic feedback for snap zones
    if (activeZone && "navigator" in window && navigator.vibrate) {
      navigator.vibrate(10);
    }

    this.updateWindowDOM(windowId);
  }

  // End window drag
  endDrag(windowId: string, finalPosition: { x: number; y: number }): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.isDragging = false;
    this.showSnapGuides(false);

    // Check if we should snap to a zone
    const snapZone = this.checkSnapZones(finalPosition);
    if (snapZone) {
      this.snapToZone(windowId, snapZone);
    } else {
      // Ensure window stays within monitor bounds
      this.constrainToMonitor(windowId);
    }

    this.updateWindowDOM(windowId);
  }

  // Snap window to specific zone
  snapToZone(windowId: string, zone: SnapZone): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    const guide = this.snapGuides.find((g) => g.zone === zone);
    if (!guide) return;

    // Store current state before snapping
    if (!window.isSnapped) {
      window.lastPosition = { ...window.position };
      window.lastSize = { ...window.size };
    }

    // Animate to snap position
    this.animateWindow(windowId, {
      position: { x: guide.rect.x, y: guide.rect.y },
      size: { width: guide.rect.width, height: guide.rect.height },
    });

    window.snapZone = zone;
    window.isSnapped = true;
    window.maximized = zone === "maximized";

    // Trigger haptic feedback
    if ("navigator" in window && navigator.vibrate) {
      navigator.vibrate([25, 15, 25]);
    }
  }

  // Unsnap window (restore to previous position)
  unsnap(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window || !window.isSnapped) return;

    this.animateWindow(windowId, {
      position: window.lastPosition,
      size: window.lastSize,
    });

    window.snapZone = null;
    window.isSnapped = false;
    window.maximized = false;
  }

  // Check which snap zone the position is in
  private checkSnapZones(position: { x: number; y: number }): SnapZone | null {
    for (const guide of this.snapGuides) {
      const { rect } = guide;
      const isNearEdge =
        (position.x <= rect.x + this.snapThreshold &&
          position.x >= rect.x - this.snapThreshold) ||
        (position.x >= rect.x + rect.width - this.snapThreshold &&
          position.x <= rect.x + rect.width + this.snapThreshold) ||
        (position.y <= rect.y + this.snapThreshold &&
          position.y >= rect.y - this.snapThreshold) ||
        (position.y >= rect.y + rect.height - this.snapThreshold &&
          position.y <= rect.y + rect.height + this.snapThreshold);

      if (isNearEdge) {
        return guide.zone;
      }
    }
    return null;
  }

  // Constrain window to monitor bounds
  private constrainToMonitor(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    const monitor = this.monitors[0]; // Primary monitor
    const { workArea } = monitor;

    // Ensure window doesn't go off-screen
    window.position.x = Math.max(
      workArea.x - window.size.width + 100, // Allow some off-screen but keep grabbable
      Math.min(workArea.x + workArea.width - 100, window.position.x),
    );

    window.position.y = Math.max(
      workArea.y,
      Math.min(workArea.y + workArea.height - 50, window.position.y),
    );
  }

  // Animate window to new position/size
  private animateWindow(
    windowId: string,
    target: {
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      opacity?: number;
      scale?: number;
    },
  ): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    const startTime = performance.now();
    const startPosition = { ...window.position };
    const startSize = { ...window.size };
    const startOpacity = window.opacity;
    const startScale = window.scale;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);

      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      // Interpolate position
      if (target.position) {
        window.position.x =
          startPosition.x + (target.position.x - startPosition.x) * eased;
        window.position.y =
          startPosition.y + (target.position.y - startPosition.y) * eased;
      }

      // Interpolate size
      if (target.size) {
        window.size.width =
          startSize.width + (target.size.width - startSize.width) * eased;
        window.size.height =
          startSize.height + (target.size.height - startSize.height) * eased;
      }

      // Interpolate opacity
      if (target.opacity !== undefined) {
        window.opacity = startOpacity + (target.opacity - startOpacity) * eased;
      }

      // Interpolate scale
      if (target.scale !== undefined) {
        window.scale = startScale + (target.scale - startScale) * eased;
      }

      this.updateWindowDOM(windowId);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // Focus window (bring to front)
  focusWindow(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    // Update z-index
    window.zIndex = ++this.highestZIndex;

    // Update focus history
    const existingIndex = this.focusHistory.indexOf(windowId);
    if (existingIndex > -1) {
      this.focusHistory.splice(existingIndex, 1);
    }
    this.focusHistory.unshift(windowId);

    // Keep only last 10 focused windows
    if (this.focusHistory.length > 10) {
      this.focusHistory.pop();
    }

    this.updateWindowDOM(windowId);
  }

  // Minimize window
  minimizeWindow(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.minimized = true;
    this.animateWindow(windowId, {
      opacity: 0,
      scale: 0.8,
    });

    // Remove from focus history
    const index = this.focusHistory.indexOf(windowId);
    if (index > -1) {
      this.focusHistory.splice(index, 1);
    }
  }

  // Restore minimized window
  restoreWindow(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.minimized = false;
    this.animateWindow(windowId, {
      opacity: 1,
      scale: 1,
    });

    this.focusWindow(windowId);
  }

  // Toggle maximize window
  toggleMaximize(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    if (window.maximized || window.snapZone === "maximized") {
      this.unsnap(windowId);
    } else {
      this.snapToZone(windowId, "maximized");
    }
  }

  // Alt+Tab window switching
  switchToNextWindow(): string | null {
    if (this.focusHistory.length < 2) return null;

    const nextWindowId = this.focusHistory[1];
    this.focusWindow(nextWindowId);
    return nextWindowId;
  }

  // Show/hide snap guides
  private showSnapGuides(show: boolean): void {
    this.showingSnapGuides = show;

    // Create or update snap guide overlays in DOM
    if (show) {
      this.createSnapGuideOverlays();
    } else {
      this.removeSnapGuideOverlays();
    }
  }

  // Create visual snap guide overlays
  private createSnapGuideOverlays(): void {
    // Remove existing overlays
    this.removeSnapGuideOverlays();

    const container = document.createElement("div");
    container.id = "snap-guides-container";
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9998;
    `;

    this.snapGuides.forEach((guide, index) => {
      const overlay = document.createElement("div");
      overlay.className = `snap-guide snap-guide-${guide.zone}`;
      overlay.style.cssText = `
        position: absolute;
        left: ${guide.rect.x}px;
        top: ${guide.rect.y}px;
        width: ${guide.rect.width}px;
        height: ${guide.rect.height}px;
        border: 2px solid rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.1);
        border-radius: 8px;
        opacity: 0;
        transition: opacity 200ms ease;
        backdrop-filter: blur(4px);
      `;

      if (guide.active) {
        overlay.style.opacity = "1";
        overlay.style.borderColor = "rgba(59, 130, 246, 0.8)";
        overlay.style.background = "rgba(59, 130, 246, 0.2)";
      }

      container.appendChild(overlay);
    });

    document.body.appendChild(container);
  }

  // Remove snap guide overlays
  private removeSnapGuideOverlays(): void {
    const existing = document.getElementById("snap-guides-container");
    if (existing) {
      existing.remove();
    }
  }

  // Update window DOM element
  private updateWindowDOM(windowId: string): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    const element = document.querySelector(
      `[data-window-id="${windowId}"]`,
    ) as HTMLElement;
    if (!element) return;

    // Update transform
    element.style.transform = `translate(${window.position.x}px, ${window.position.y}px) scale(${window.scale})`;
    element.style.width = `${window.size.width}px`;
    element.style.height = `${window.size.height}px`;
    element.style.zIndex = window.zIndex.toString();
    element.style.opacity = window.opacity.toString();

    if (window.blur > 0) {
      element.style.filter = `blur(${window.blur}px)`;
    } else {
      element.style.filter = "";
    }

    // Add visual feedback for dragging
    if (window.isDragging) {
      element.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.3)";
      element.style.transform += " rotateZ(2deg)";
    } else {
      element.style.boxShadow = "";
    }
  }

  // Setup global event listeners
  private setupEventListeners(): void {
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        this.switchToNextWindow();
      }

      // Window snapping shortcuts
      if (e.metaKey || e.ctrlKey) {
        const focusedWindow = this.focusHistory[0];
        if (!focusedWindow) return;

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            this.snapToZone(focusedWindow, "left-half");
            break;
          case "ArrowRight":
            e.preventDefault();
            this.snapToZone(focusedWindow, "right-half");
            break;
          case "ArrowUp":
            e.preventDefault();
            this.snapToZone(focusedWindow, "maximized");
            break;
          case "ArrowDown":
            e.preventDefault();
            this.minimizeWindow(focusedWindow);
            break;
        }
      }
    });
  }

  // Get window state
  getWindow(windowId: string): WindowState | undefined {
    return this.windows.get(windowId);
  }

  // Get all windows
  getAllWindows(): WindowState[] {
    return Array.from(this.windows.values());
  }

  // Get focused window
  getFocusedWindow(): WindowState | undefined {
    const focusedId = this.focusHistory[0];
    return focusedId ? this.windows.get(focusedId) : undefined;
  }

  // Remove window
  removeWindow(windowId: string): void {
    this.windows.delete(windowId);
    const index = this.focusHistory.indexOf(windowId);
    if (index > -1) {
      this.focusHistory.splice(index, 1);
    }
  }

  // Get window management statistics
  getStats(): any {
    return {
      totalWindows: this.windows.size,
      minimizedWindows: Array.from(this.windows.values()).filter(
        (w) => w.minimized,
      ).length,
      snappedWindows: Array.from(this.windows.values()).filter(
        (w) => w.isSnapped,
      ).length,
      highestZIndex: this.highestZIndex,
      focusHistory: this.focusHistory.slice(0, 5),
      monitors: this.monitors.length,
    };
  }
}

export const windowManager = AdvancedWindowManager.getInstance();
