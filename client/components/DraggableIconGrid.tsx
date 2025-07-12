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
  getCellSize: () => { width: number; height: number; size: number };
  GRID_COLS: number;
  GRID_ROWS: number;
}

function DraggableIcon({
  appId,
  icon,
  name,
  position,
  onPositionChange,
  onOpen,
  getCellSize,
  GRID_COLS,
  GRID_ROWS,
}: DraggableIconProps) {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!iconRef.current) return;

    setIsDragging(true);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startGridX = position.gridX;
    const startGridY = position.gridY;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const { width: cellWidth, height: cellHeight } = getCellSize();

      // Calculate which grid cell the mouse is over
      const gridX = Math.floor((e.clientX - 20) / cellWidth);
      const gridY = Math.floor((e.clientY - 80) / cellHeight);

      // Constrain to grid bounds
      const constrainedGridX = Math.max(0, Math.min(GRID_COLS - 1, gridX));
      const constrainedGridY = Math.max(0, Math.min(GRID_ROWS - 1, gridY));

      // Only update if position changed
      if (
        constrainedGridX !== position.gridX ||
        constrainedGridY !== position.gridY
      ) {
        const newX = constrainedGridX * cellWidth + 20;
        const newY = constrainedGridY * cellHeight + 80;

        const newPosition: IconPosition = {
          x: newX,
          y: newY,
          gridX: constrainedGridX,
          gridY: constrainedGridY,
        };

        onPositionChange(appId, newPosition);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Check if this was a click (minimal movement) vs drag
      const deltaX = Math.abs(e.clientX - startMouseX);
      const deltaY = Math.abs(e.clientY - startMouseY);

      if (deltaX < 5 && deltaY < 5) {
        // This was a click, not a drag
        onOpen(appId);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

  // Calculate current cell dimensions for rendering
  const { width: cellWidth, height: cellHeight } = getCellSize();

  // Show grid overlay when dragging
  const isDraggingAny = Object.values(iconPositions).some(() => false); // We'll update this logic

  return (
    <div ref={gridRef} className="relative w-full h-full">
      {/* 15x5 Grid overlay for visual reference */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full">
          {(() => {
            const lines = [];

            // Vertical lines (15 columns)
            for (let i = 0; i <= GRID_COLS; i++) {
              const x = i * cellWidth + 20;
              lines.push(
                <line
                  key={`v-${i}`}
                  x1={x}
                  y1={80}
                  x2={x}
                  y2={80 + GRID_ROWS * cellHeight}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />,
              );
            }

            // Horizontal lines (5 rows)
            for (let i = 0; i <= GRID_ROWS; i++) {
              const y = i * cellHeight + 80;
              lines.push(
                <line
                  key={`h-${i}`}
                  x1={20}
                  y1={y}
                  x2={20 + GRID_COLS * cellWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />,
              );
            }

            return lines;
          })()}
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
                getCellSize={getCellSize}
                GRID_COLS={GRID_COLS}
                GRID_ROWS={GRID_ROWS}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
