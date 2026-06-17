"use client";

import React, { useState, useEffect, useRef } from "react";
import SplitText from "./SplitText";
import "./ProposalPage.css";
import yesSticker from "./propose/yes.jpeg";
import noSticker from "./propose/no.jpeg";

interface ProposalPageProps {
  onBackClick: () => void;
}

export default function ProposalPage({ onBackClick }: ProposalPageProps) {
  const [selectedResponse, setSelectedResponse] = useState<"yes" | "no" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const heartsRef = useRef<any[]>([]);

  // Canvas Hearts animation for YES click
  useEffect(() => {
    if (selectedResponse !== "yes") {
      heartsRef.current = [];
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class HeartParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      rotation: number;
      rotationSpeed: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + 20;
        this.size = Math.random() * 18 + 8;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = -(Math.random() * 5 + 3);
        const hues = [0, 340, 350, 10]; // Red/Pink hues
        this.color = `hsla(${hues[Math.floor(Math.random() * hues.length)]}, 100%, 65%, `;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.04 - 0.02;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.opacity > 0.01) this.opacity -= 0.003;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color + "1)";

        // Draw Heart
        context.beginPath();
        context.moveTo(0, -this.size / 2);
        context.bezierCurveTo(
          this.size / 2, -this.size,
          this.size, -this.size / 2,
          0, this.size
        );
        context.bezierCurveTo(
          -this.size, -this.size / 2,
          -this.size / 2, -this.size,
          0, -this.size / 2
        );
        context.closePath();
        context.fill();
        context.restore();
      }
    }

    // Spawn initial hearts
    for (let i = 0; i < 45; i++) {
      heartsRef.current.push(new HeartParticle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly spawn more hearts
      if (Math.random() < 0.12 && heartsRef.current.length < 150) {
        heartsRef.current.push(new HeartParticle(canvas.width, canvas.height));
      }

      heartsRef.current.forEach((heart, index) => {
        heart.update();
        heart.draw(ctx);
        if (heart.y < -50 || heart.opacity <= 0.02) {
          heartsRef.current.splice(index, 1);
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [selectedResponse]);

  // Wheel scroll up & touch swipe right to go back
  useEffect(() => {
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 600) return; // Cooldown

      if (e.deltaY < 0) {
        // Scroll Up -> Go back to Video Gallery
        lastScrollTime = now;
        onBackClick();
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchHasTriggered = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchHasTriggered = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchHasTriggered) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = touchStartX - currentX;
      const diffY = touchStartY - currentY;

      // Swipe right to go back
      if (Math.abs(diffX) > Math.abs(diffY) && diffX < -65) {
        onBackClick();
        touchHasTriggered = true;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onBackClick]);

  const handleCardClick = (response: "yes" | "no") => {
    setSelectedResponse(response);
  };

  return (
    <div className="proposal-page-root relative w-full h-full flex flex-col justify-center items-center overflow-hidden">
      {/* Canvas overlay for YES hearts */}
      {selectedResponse === "yes" && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
      )}

      {/* Floating Sparkles in the background */}
      <div className="absolute inset-0 bg-stars opacity-45 pointer-events-none" />

      {/* Back Button */}
      <button 
        className="proposal-back-btn absolute top-6 left-6 z-[95] px-8 py-3 rounded-full border border-white/30 text-white font-sans text-sm uppercase tracking-widest bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-300"
        onClick={onBackClick}
      >
        Go Back
      </button>

      {/* Proposal Heading */}
      <div className="proposal-header text-center z-20 mb-12 select-none px-4">
        <SplitText
          text="u asked proposel right"
          className="font-serif italic text-white text-4xl md:text-6xl tracking-wide font-light drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]"
          delay={120}
          duration={0.8}
          splitType="chars"
        />
        <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] mt-3">
          Hover and click on your choice
        </p>
      </div>

      {/* Two Book cards */}
      <div className="books-container z-20">
        {/* YES Card */}
        <div 
          className={`book yes-card ${selectedResponse === "yes" ? "clicked" : ""}`}
          onClick={() => handleCardClick("yes")}
        >
          <div className="cover">
            <p>YES</p>
          </div>
          <div className="inner-content">
            <p className="font-serif italic text-rose-700 font-bold mb-2">My Answer</p>
            <p className="inner-text">
              haha i know if a handsome boy like me sent proposel no one wil say no, if u have dare say no
            </p>
            <img src={yesSticker.src} alt="Yes Sticker" className="propose-sticker" />
          </div>
        </div>

        {/* NO Card */}
        <div 
          className={`book no-card ${selectedResponse === "no" ? "clicked" : ""}`}
          onClick={() => handleCardClick("no")}
        >
          <div className="cover">
            <p>NO</p>
          </div>
          <div className="inner-content">
            <p className="font-serif italic text-slate-700 font-bold mb-2">Oops!</p>
            <p className="inner-text">
              fool u think i will give option for u go and study witch cant even passss saying no
            </p>
            <img src={noSticker.src} alt="No Sticker" className="propose-sticker" />
          </div>
        </div>
      </div>

      {/* Custom feedback message modals overlay */}
      {selectedResponse && (
        <div 
          className="modal-backdrop fixed inset-0 bg-black/85 flex items-center justify-center p-6 z-[100] animate-[fadeIn_0.35s_ease]"
          onClick={() => setSelectedResponse(null)}
        >
          <div 
            className={`modal-box p-8 max-w-md w-full rounded-2xl text-center shadow-2xl relative pointer-events-auto border animate-[scaleIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] ${
              selectedResponse === "yes" 
                ? "bg-rose-50 border-rose-200 text-rose-950" 
                : "bg-slate-50 border-slate-200 text-slate-950"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Icon / Image Sticker */}
            <div className="flex justify-center mb-5">
              <img 
                src={selectedResponse === "yes" ? yesSticker.src : noSticker.src} 
                alt="Reaction Sticker" 
                className="w-24 h-24 object-contain rounded-xl shadow-md border border-black/10 bg-white"
              />
            </div>

            {/* Modal Message */}
            <p className="font-serif text-lg md:text-xl leading-relaxed italic font-medium mb-6">
              {selectedResponse === "yes" 
                ? "haha i know if a handsome boy like me sent proposel no one wil say no, if u have dare say no 😎"
                : "fool u think i will give option for u go and study witch cant even passss saying no 🧹📖"
              }
            </p>

            {/* Action button */}
            <button 
              className={`px-8 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-md ${
                selectedResponse === "yes" 
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200" 
                  : "bg-slate-800 hover:bg-slate-900 shadow-slate-200"
              }`}
              onClick={() => setSelectedResponse(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
