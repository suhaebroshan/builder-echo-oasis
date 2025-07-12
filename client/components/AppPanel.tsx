import { ReactNode, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAppStore, type AppId } from "../stores/appStore";
import { cn } from "../lib/utils";

interface AppPanelProps {
  appId: AppId;
  title: string;
  children: ReactNode;
  className?: string;
  fullscreen?: boolean;
}

export function AppPanel({
  appId,
  title,
  children,
  className,
  fullscreen = false,
}: AppPanelProps) {
  const { theme } = useTheme();
  const { apps, closeApp, bringToFront } = useAppStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const app = apps[appId];
  const isOpen = app?.isOpen ?? false;

  useEffect(() => {
    if (!isOpen || !panelRef.current || !dragRef.current) return;

    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
    let xOffset = app.position.x;
    let yOffset = app.position.y;

    const dragStart = (e: MouseEvent | TouchEvent) => {
      if (fullscreen) return;

      if (e.type === "touchstart") {
        initialX = (e as TouchEvent).touches[0].clientX - xOffset;
        initialY = (e as TouchEvent).touches[0].clientY - yOffset;
      } else {
        initialX = (e as MouseEvent).clientX - xOffset;
        initialY = (e as MouseEvent).clientY - yOffset;
      }

      if ((e.target as HTMLElement).closest(dragRef.current!)) {
        isDragging = true;
        bringToFront(appId);
      }
    };

    const dragEnd = () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    };

    const drag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || fullscreen) return;

      e.preventDefault();

      if (e.type === "touchmove") {
        currentX = (e as TouchEvent).touches[0].clientX - initialX;
        currentY = (e as TouchEvent).touches[0].clientY - initialY;
      } else {
        currentX = (e as MouseEvent).clientX - initialX;
        currentY = (e as MouseEvent).clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      if (panelRef.current) {
        panelRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    };

    dragRef.current.addEventListener("mousedown", dragStart);
    dragRef.current.addEventListener("touchstart", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);

    return () => {
      if (dragRef.current) {
        dragRef.current.removeEventListener("mousedown", dragStart);
        dragRef.current.removeEventListener("touchstart", dragStart);
      }
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchend", dragEnd);
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("touchmove", drag);
    };
  }, [isOpen, appId, app.position, bringToFront, fullscreen]);

  const handleClose = () => {
    closeApp(appId);
  };

  const handlePanelClick = () => {
    bringToFront(appId);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      onClick={handlePanelClick}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "transition-all duration-300 ease-out",
        fullscreen ? "p-0" : "p-4",
      )}
      style={{
        zIndex: app.zIndex + 1000,
        transform: fullscreen
          ? "none"
          : `translate(${app.position.x}px, ${app.position.y}px)`,
      }}
    >
      <div
        className={cn(
          "relative flex flex-col",
          "backdrop-blur-xl border shadow-glass",
          "transition-all duration-300 ease-out",
          fullscreen
            ? "w-full h-full rounded-none"
            : "w-[90vw] max-w-2xl h-[80vh] max-h-[600px] rounded-3xl",
          theme === "sam"
            ? "bg-sam-black/80 border-sam-pink/30"
            : "bg-nova-blue/20 border-nova-cyan/30",
          className,
        )}
      >
        {/* Window Controls */}
        <div
          ref={dragRef}
          className={cn(
            "flex items-center justify-between p-4",
            "border-b border-white/10 cursor-move",
            fullscreen && "cursor-default",
          )}
        >
          <h2
            className={cn(
              "text-lg font-semibold",
              theme === "sam" ? "text-sam-pink" : "text-nova-cyan",
            )}
          >
            {title}
          </h2>

          <div className="flex items-center gap-2">
            {!fullscreen && (
              <button
                className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors"
                aria-label="Minimize"
              />
            )}
            <button
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

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
