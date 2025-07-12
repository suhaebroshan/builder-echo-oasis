import { ReactNode, useRef, useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAppStore, type AppId } from "../stores/appStore";
import { LiquidGlass } from "./LiquidGlass";
import { cn } from "../lib/utils";

interface ResizableWindowProps {
  appId: AppId;
  title: string;
  children: ReactNode;
  className?: string;
  fullscreen?: boolean;
  minimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export function ResizableWindow({
  appId,
  title,
  children,
  className,
  fullscreen = false,
  minimized = false,
  onMinimize,
  onMaximize,
  onClose,
}: ResizableWindowProps) {
  const { theme } = useTheme();
  const { apps, closeApp, minimizeApp, maximizeApp, restoreApp, bringToFront } =
    useAppStore();
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const app = apps[appId];
  const isOpen = app?.isOpen ?? false;
  const isMinimized = app?.isMinimized ?? false;
  const isMaximized = app?.isMaximized ?? false;

  const [windowState, setWindowState] = useState({
    x: app?.position.x || 0,
    y: app?.position.y || 0,
    width: app?.size.width || 800,
    height: app?.size.height || 600,
    isDragging: false,
    isResizing: false,
    resizeDirection: "",
  });

  useEffect(() => {
    if (!isOpen || !windowRef.current) return;

    // Set initial position and size
    const initialX = app.position.x || 100;
    const initialY = app.position.y || 100;

    setWindowState((prev) => ({
      ...prev,
      x: initialX,
      y: initialY,
    }));
  }, [isOpen, app.position]);

  const handleMouseDown = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    bringToFront(appId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWindowX = windowState.x;
    const startWindowY = windowState.y;
    const startWidth = windowState.width;
    const startHeight = windowState.height;

    const handleMouseMove = (e: MouseEvent) => {
      if (action === "drag") {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        setWindowState((prev) => ({
          ...prev,
          x: Math.max(0, startWindowX + deltaX),
          y: Math.max(0, startWindowY + deltaY),
          isDragging: true,
        }));
      } else if (action.startsWith("resize")) {
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startWindowX;
        let newY = startWindowY;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        if (action.includes("right")) {
          newWidth = Math.max(300, startWidth + deltaX);
        }
        if (action.includes("left")) {
          newWidth = Math.max(300, startWidth - deltaX);
          newX = startWindowX + deltaX;
        }
        if (action.includes("bottom")) {
          newHeight = Math.max(200, startHeight + deltaY);
        }
        if (action.includes("top")) {
          newHeight = Math.max(200, startHeight - deltaY);
          newY = startWindowY + deltaY;
        }

        setWindowState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
          isResizing: true,
        }));
      }
    };

    const handleMouseUp = () => {
      setWindowState((prev) => ({
        ...prev,
        isDragging: false,
        isResizing: false,
      }));
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMaximize = () => {
    maximizeApp(appId);
    onMaximize?.();
  };

  const handleMinimize = () => {
    minimizeApp(appId);
    onMinimize?.();
  };

  const handleClose = () => {
    closeApp(appId);
    onClose?.();
  };

  if (!isOpen || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed z-50 select-none",
        "animate-in fade-in slide-in-from-bottom-8 duration-300",
        windowState.isDragging && "cursor-move",
        windowState.isResizing && "cursor-nw-resize",
      )}
      style={{
        left: isMaximized ? 0 : windowState.x,
        top: isMaximized ? 0 : windowState.y,
        width: isMaximized ? "100vw" : windowState.width,
        height: isMaximized ? "100vh" : windowState.height,
        zIndex: app.zIndex + 1000,
      }}
    >
            {/* Window Container */}
      <LiquidGlass
        variant="panel"
        intensity="heavy"
        animated={true}
        className={cn(
          "relative flex flex-col w-full h-full",
          isMaximized ? "rounded-none" : "rounded-2xl sm:rounded-3xl",
          className,
        )}
      >
        {/* Title Bar */}
        <div
          ref={dragRef}
          onMouseDown={(e) => !isMaximized && handleMouseDown(e, "drag")}
          className={cn(
            "flex items-center justify-between p-4",
            "border-b border-white/10",
            !isMaximized && "cursor-move",
          )}
        >
          <h2
            className={cn(
              "text-lg font-semibold select-none",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            {title}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors"
              aria-label="Minimize"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-300 transition-colors"
              aria-label="Maximize"
            />
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-300 transition-colors"
              aria-label="Close"
            />
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden">{children}</div>

        {/* Resize Handles */}
        {!isMaximized && (
          <>
            {/* Corner Handles */}
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-top-left")}
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-top-right")}
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-bottom-left")}
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-bottom-right")}
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            />

            {/* Edge Handles */}
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-top")}
              className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-bottom")}
              className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-left")}
              className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, "resize-right")}
              className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            />
          </>
        )}
      </div>
    </div>
  );
}