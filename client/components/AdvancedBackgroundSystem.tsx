import { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
  opacity: number;
  color: string;
  life: number; // 0-1
  maxLife: number;
  type: "orb" | "spark" | "energy" | "quantum";
  gravitationalPull: number;
  mass: number;
}

interface PhysicsState {
  mousePosition: { x: number; y: number };
  gravityStrength: number;
  windForce: { x: number; y: number };
  timeScale: number;
  particleCount: number;
}

export function AdvancedBackgroundSystem() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const physicsRef = useRef<PhysicsState>({
    mousePosition: { x: 0, y: 0 },
    gravityStrength: 0.0001,
    windForce: { x: 0.00005, y: 0 },
    timeScale: 1,
    particleCount: 80,
  });

  const [performanceMode, setPerformanceMode] = useState("high"); // high, medium, low

  // Color schemes for different themes
  const getThemeColors = () => {
    if (theme === "sam") {
      return {
        primary: ["#ec4899", "#f472b6", "#fb7185"],
        secondary: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
        accent: ["#06b6d4", "#0891b2", "#0e7490"],
        glow: "#ec4899",
      };
    } else {
      return {
        primary: ["#3b82f6", "#60a5fa", "#93c5fd"],
        secondary: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
        accent: ["#06b6d4", "#22d3ee", "#67e8f9"],
        glow: "#3b82f6",
      };
    }
  };

  // Initialize particles
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = getThemeColors();
    const allColors = [
      ...colors.primary,
      ...colors.secondary,
      ...colors.accent,
    ];
    const particles: Particle[] = [];

    for (let i = 0; i < physicsRef.current.particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 60 + 20,
        opacity: Math.random() * 0.6 + 0.2,
        color: allColors[Math.floor(Math.random() * allColors.length)],
        life: Math.random(),
        maxLife: Math.random() * 30 + 10,
        type: ["orb", "spark", "energy", "quantum"][
          Math.floor(Math.random() * 4)
        ] as Particle["type"],
        gravitationalPull: Math.random() * 0.1 + 0.05,
        mass: Math.random() * 5 + 1,
      });
    }

    particlesRef.current = particles;
  };

  // Physics simulation
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const physics = physicsRef.current;
    const particles = particlesRef.current;

    particles.forEach((particle, index) => {
      // Apply gravitational attraction to mouse
      const dx = physics.mousePosition.x - particle.x;
      const dy = physics.mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const force = (physics.gravityStrength * particle.mass) / distance;
        particle.vx += (dx / distance) * force * deltaTime;
        particle.vy += (dy / distance) * force * deltaTime;
      }

      // Apply wind force
      particle.vx += physics.windForce.x * deltaTime;
      particle.vy += physics.windForce.y * deltaTime;

      // Apply damping
      particle.vx *= 0.999;
      particle.vy *= 0.999;

      // Update position
      particle.x += particle.vx * deltaTime * physics.timeScale;
      particle.y += particle.vy * deltaTime * physics.timeScale;

      // Boundary collision with bounce
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }

      // Life cycle
      particle.life += deltaTime / (particle.maxLife * 1000);
      if (particle.life > 1) {
        // Respawn particle
        particle.life = 0;
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
      }

      // Particle interactions
      for (let j = index + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx2 = other.x - particle.x;
        const dy2 = other.y - particle.y;
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        // Attraction/repulsion between particles
        if (distance2 < 100 && distance2 > 0) {
          const force2 = 0.00001 / distance2;
          const fx = (dx2 / distance2) * force2;
          const fy = (dy2 / distance2) * force2;

          particle.vx += fx;
          particle.vy += fy;
          other.vx -= fx;
          other.vy -= fy;
        }
      }
    });
  };

  // Render particles with advanced effects
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    const colors = getThemeColors();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particles.forEach((particle) => {
      ctx.save();

      // Calculate dynamic opacity based on life and distance to mouse
      const dx = physicsRef.current.mousePosition.x - particle.x;
      const dy = physicsRef.current.mousePosition.y - particle.y;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      const proximityBoost = Math.max(0, 1 - mouseDistance / 200);

      const baseOpacity = particle.opacity * (1 - particle.life * 0.3);
      const finalOpacity = Math.min(1, baseOpacity + proximityBoost * 0.3);

      // Create gradient based on particle type
      let gradient: CanvasGradient;

      switch (particle.type) {
        case "orb":
          gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size,
          );
          gradient.addColorStop(
            0,
            `${particle.color}${Math.floor(finalOpacity * 255).toString(16)}`,
          );
          gradient.addColorStop(
            0.7,
            `${particle.color}${Math.floor(finalOpacity * 128).toString(16)}`,
          );
          gradient.addColorStop(1, "transparent");
          break;

        case "energy":
          gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 1.5,
          );
          gradient.addColorStop(
            0,
            `${colors.glow}${Math.floor(finalOpacity * 200).toString(16)}`,
          );
          gradient.addColorStop(
            0.5,
            `${particle.color}${Math.floor(finalOpacity * 100).toString(16)}`,
          );
          gradient.addColorStop(1, "transparent");
          break;

        case "quantum":
          // Quantum particles have unstable appearance
          const flickerOpacity =
            finalOpacity *
            (0.5 + 0.5 * Math.sin(Date.now() * 0.01 + particle.id));
          gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 0.8,
          );
          gradient.addColorStop(
            0,
            `${particle.color}${Math.floor(flickerOpacity * 255).toString(16)}`,
          );
          gradient.addColorStop(1, "transparent");
          break;

        default: // spark
          gradient = ctx.createLinearGradient(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.x + particle.size / 2,
            particle.y + particle.size / 2,
          );
          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(
            0.5,
            `${particle.color}${Math.floor(finalOpacity * 255).toString(16)}`,
          );
          gradient.addColorStop(1, "transparent");
      }

      // Apply blur effect
      ctx.filter = `blur(${particle.size * 0.1}px)`;
      ctx.fillStyle = gradient;

      // Draw particle with shape based on type
      ctx.beginPath();
      if (particle.type === "spark") {
        // Draw diamond shape for sparks
        ctx.moveTo(particle.x, particle.y - particle.size / 2);
        ctx.lineTo(particle.x + particle.size / 2, particle.y);
        ctx.lineTo(particle.x, particle.y + particle.size / 2);
        ctx.lineTo(particle.x - particle.size / 2, particle.y);
        ctx.closePath();
      } else {
        // Draw circle for other types
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      }
      ctx.fill();

      // Add glow effect for high energy particles
      if (particle.type === "energy" && proximityBoost > 0.2) {
        ctx.filter = `blur(${particle.size * 0.3}px)`;
        ctx.fillStyle = `${colors.glow}${Math.floor(proximityBoost * 100).toString(16)}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Draw connection lines between nearby particles
    if (performanceMode === "high") {
      particles.forEach((particle, index) => {
        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const lineOpacity = (1 - distance / 150) * 0.1;
            ctx.strokeStyle = `${colors.primary[0]}${Math.floor(lineOpacity * 255).toString(16)}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
    }
  };

  // Animation loop
  const animate = (currentTime: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const deltaTime = 16; // Approximate 60 FPS

    updateParticles(deltaTime);
    renderParticles(ctx);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Mouse tracking
  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    physicsRef.current.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // Handle window resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  };

  // Performance monitoring
  useEffect(() => {
    const checkPerformance = () => {
      const fps = 60; // Simplified - would measure actual FPS in production
      if (fps < 30) {
        setPerformanceMode("low");
        physicsRef.current.particleCount = 30;
      } else if (fps < 45) {
        setPerformanceMode("medium");
        physicsRef.current.particleCount = 50;
      } else {
        setPerformanceMode("high");
        physicsRef.current.particleCount = 80;
      }
    };

    const interval = setInterval(checkPerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initializeParticles();
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, performanceMode]);

  // Wind effect based on theme
  useEffect(() => {
    const updateWindPattern = () => {
      const time = Date.now() * 0.001;
      physicsRef.current.windForce = {
        x: Math.sin(time * 0.1) * 0.00002,
        y: Math.cos(time * 0.15) * 0.00001,
      };
    };

    const interval = setInterval(updateWindPattern, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "transparent" }}
      />

      {/* Performance indicator */}
      <div className="fixed bottom-4 right-4 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
          <div>Performance: {performanceMode}</div>
          <div>Particles: {physicsRef.current.particleCount}</div>
          <div className="flex items-center gap-1 mt-1">
            <span>Physics:</span>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                performanceMode === "high"
                  ? "bg-green-400"
                  : performanceMode === "medium"
                    ? "bg-yellow-400"
                    : "bg-red-400",
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}
