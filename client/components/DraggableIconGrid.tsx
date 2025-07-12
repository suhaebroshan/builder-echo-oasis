import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAppStore, type AppId } from "../stores/appStore";
import { cn } from "../lib/utils";

interface IconPosition {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
}

interface DraggableIconProps {
  appId: AppId;
  icon: string;
  name: string;
  position: IconPosition;
  onPositionChange: (appId: AppId, position: IconPosition) => void;
  onOpen: (appId: AppId) => void;
  gridSize: number;
}

function DraggableIcon({
  appId,
  icon,
  name,
  position,
  onPositionChange,
  onOpen,
  gridSize,
}: DraggableIconProps) {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!iconRef.current) return;

    const rect = iconRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(
        0,
        Math.min(window.innerWidth - 80, e.clientX - offsetX),
      );
      const newY = Math.max(
        60,
        Math.min(window.innerHeight - 200, e.clientY - offsetY),
      ); // Account for status bar and nav

      const gridX = Math.round(newX / gridSize);
      const gridY = Math.round((newY - 60) / gridSize); // Adjust for status bar

      const newPosition: IconPosition = {
        x: newX,
        y: newY,
        gridX: Math.max(0, gridX),
        gridY: Math.max(0, gridY),
      };

      onPositionChange(appId, newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Snap to grid
      const snappedPosition: IconPosition = {
        x: position.gridX * gridSize,
        y: position.gridY * gridSize + 60, // Account for status bar
        gridX: position.gridX,
        gridY: position.gridY,
      };
      onPositionChange(appId, snappedPosition);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleClick = () => {
    if (!isDragging) {
      onOpen(appId);
    }
  };

  return (
    <button
      ref={iconRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={cn(
        "group absolute flex flex-col items-center justify-center",
        "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl transition-all duration-300",
        "backdrop-blur-md border border-white/20",
        "hover:scale-110 hover:shadow-glow active:scale-95",
        "select-none cursor-pointer",
        isDragging && "z-50 scale-110 shadow-glow cursor-grabbing",
        theme === "sam"
          ? "bg-sam-black/60 hover:bg-sam-pink/20 hover:border-sam-pink/50"
          : "bg-nova-blue/20 hover:bg-nova-cyan/30 hover:border-nova-cyan/60",
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform pointer-events-none">
        {icon}
      </span>
      <span
        className={cn(
          "absolute -bottom-6 sm:-bottom-8 text-xs font-medium opacity-0",
          "group-hover:opacity-100 transition-opacity duration-200",
          "text-white drop-shadow-lg text-center max-w-20 pointer-events-none",
          !isDragging && "group-hover:opacity-100",
        )}
      >
        {name}
      </span>
    </button>
  );
}

export function DraggableIconGrid() {
  const { apps, openApp } = useAppStore();
  const [iconPositions, setIconPositions] = useState<
    Partial<Record<AppId, IconPosition>>
  >({});
  const gridRef = useRef<HTMLDivElement>(null);

  // Fixed 15x5 grid system
  const GRID_COLS = 15;
  const GRID_ROWS = 5;

  // Calculate cell size based on available screen space
  const getCellSize = () => {
    const availableWidth = window.innerWidth - 40; // 20px padding on each side
    const availableHeight = window.innerHeight - 240; // Account for status bar (60px) and nav (180px)

    const cellWidth = availableWidth / GRID_COLS;
    const cellHeight = availableHeight / GRID_ROWS;

    return {
      width: cellWidth,
      height: cellHeight,
      size: Math.min(cellWidth, cellHeight), // Use smaller dimension for square cells
    };
  };

  // Initialize icon positions in the 15x5 grid
  useEffect(() => {
    const initialPositions: Partial<Record<AppId, IconPosition>> = {};
    const appIds = Object.keys(apps);
    const { width: cellWidth, height: cellHeight } = getCellSize();

    appIds.forEach((appId, index) => {
      // Place icons starting from top-left, row by row
      const gridX = index % GRID_COLS;
      const gridY = Math.floor(index / GRID_COLS);

      // Only place if within grid bounds
      if (gridY < GRID_ROWS) {
        initialPositions[appId as AppId] = {
          x: gridX * cellWidth + 20, // 20px left padding
          y: gridY * cellHeight + 80, // 80px top padding (status bar + some space)
          gridX,
          gridY,
        };
      }
    });
    setIconPositions(initialPositions);
  }, [apps]);

  const handlePositionChange = (appId: AppId, position: IconPosition) => {
    setIconPositions((prev: Partial<Record<AppId, IconPosition>>) => ({
      ...prev,
      [appId]: position,
    }));
  };

  // Show grid overlay when dragging
  const isDraggingAny = Object.values(iconPositions).some(() => false); // We'll update this logic

  return (
    <div ref={gridRef} className="relative w-full h-full">
      {/* Grid overlay for visual reference */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* App Icons */}
      <div className="relative w-full h-full">
        {Object.values(apps).map((app, index) => {
          const position = iconPositions[app.id];
          if (!position) return null;

          return (
            <div
              key={app.id}
              className="animate-in slide-in-from-bottom-8 fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <DraggableIcon
                appId={app.id}
                icon={app.icon}
                name={app.name}
                position={position}
                onPositionChange={handlePositionChange}
                onOpen={openApp}
                gridSize={gridSize}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
