"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  scaleSpeed: number;
  angle: number;
  spin: number;
  type: "heart" | "star";
  color: string;
}

export default function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 24 : 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = [
      "rgba(255, 255, 255, 0.4)",  // white sparkle
      "rgba(200, 220, 255, 0.4)",  // light blue sparkle
      "rgba(77, 136, 255, 0.2)",   // soft sky blue bubble
      "rgba(255, 255, 255, 0.55)", // bright white
      "rgba(180, 210, 255, 0.45)", // light sky blue
    ];

    const drawBubble = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - size * 0.25, y - size * 0.25, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fill();
    };

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * size + x,
          Math.sin(((18 + i * 72) * Math.PI) / 180) * size + y
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2) + x,
          Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2) + y
        );
      }
      ctx.closePath();
      ctx.fill();
    };

    const createParticle = (yOffset = 0): Particle => {
      const type = Math.random() > 0.4 ? "heart" : "star";
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + yOffset + Math.random() * 40,
        size: Math.random() * (type === "heart" ? 18 : 8) + 6,
        speedY: -(Math.random() * 1.2 + 0.4),
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        fadeSpeed: 0.002,
        scaleSpeed: Math.random() * 0.005 - 0.0025,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Pre-populate particles across screen
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height; // Distribute vertically
      particles.push(p);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles if count is low
      if (particles.length < maxParticles) {
        particles.push(createParticle());
      }

      particles.forEach((p, index) => {
        // Update physics
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;
        p.size = Math.max(2, p.size + p.scaleSpeed);

        // Slow hover force from mouse pointer (repulsion)
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 0.8; // subtle vertical boost
          }
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.type === "heart") {
          drawBubble(ctx, 0, 0, p.size);
        } else {
          drawStar(ctx, 0, 0, p.size);
        }

        ctx.restore();

        // Check if out of bounds or invisible
        if (p.y < -50 || p.size <= 2 || p.x < -50 || p.x > canvas.width + 50) {
          particles[index] = createParticle();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 block h-full w-full"
    />
  );
}
