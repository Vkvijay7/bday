"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Download, X, Lock, Heart, Smile, Sparkles } from "lucide-react";
import "./VideoGallery.css";

// Import images directly using Next.js asset resolver to guarantee loading
import thumb1 from "../../public/bday-1.png";
import thumb2 from "../../public/bday-2.jpg";
import thumb3 from "../../public/bday-3.png";

interface SlideData {
  title: string;
  sub: string;
  description: string;
  videoSrc: string;
  thumbnail: string;
  icon: React.ReactNode;
}

const SLIDES: SlideData[] = [
  {
    title: "Chords of Love",
    sub: "Memory 01",
    description: "Laughter, conversations, and the quiet comfort of just being ourselves. Every second spent with you is a melody I want to keep on repeat. Happy Birthday, Ankita!",
    videoSrc: "https://github.com/Vkvijay7/bday/releases/download/v1.0.0/1.mp4",
    thumbnail: thumb1.src,
    icon: <Heart size={18} className="text-[#ED5565] fill-[#ED5565]" />,
  },
  {
    title: "Glimpses of Joy",
    sub: "Memory 02",
    description: "A collection of smiles, inside jokes, and the beautiful randomness that makes our friendship so irreplaceable. Thank you for filling my life with color.",
    videoSrc: "https://github.com/Vkvijay7/bday/releases/download/v1.0.0/2.mp4",
    thumbnail: thumb2.src,
    icon: <Smile size={18} className="text-[#FC6E51]" />,
  },
  {
    title: "Infinite Skies",
    sub: "Memory 03",
    description: "Through every flight of imagination, every shared dream, and every step of the journey, you have been my favorite destination. Here's to our infinite horizon.",
    videoSrc: "https://github.com/Vkvijay7/bday/releases/download/v1.0.0/3.mp4",
    thumbnail: thumb3.src,
    icon: <Sparkles size={18} className="text-[#FFCE54] fill-[#FFCE54]" />,
  },
];

interface VideoGalleryProps {
  onScrollUpExit?: () => void;
  onScrollDownExit?: () => void;
}

export default function VideoGallery({ onScrollUpExit, onScrollDownExit }: VideoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  // Gating system: user must click/play a video to unlock the next one
  const [watchedSlides, setWatchedSlides] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });

  const watchedSlidesRef = useRef(watchedSlides);

  useEffect(() => {
    watchedSlidesRef.current = watchedSlides;
  }, [watchedSlides]);

  const playVideo = (idx: number) => {
    setFullscreenVideo(SLIDES[idx].videoSrc);
    setWatchedSlides((prev) => ({ ...prev, [idx]: true }));
  };

  const handleOptionClick = (idx: number) => {
    if (idx === activeIndex) {
      // Already active! Play the video
      playVideo(idx);
      return;
    }

    // Going backward is always allowed
    if (idx < activeIndex) {
      setActiveIndex(idx);
      return;
    }

    // Check if all previous slides up to idx are watched before expanding
    for (let i = 0; i < idx; i++) {
      if (!watchedSlidesRef.current[i]) {
        console.log(`Locked! Watch slide ${i + 1} first.`);
        return;
      }
    }

    setActiveIndex(idx);
  };

  // Bind mouse scroll (wheel) and touch swipes to navigate slides
  useEffect(() => {
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 600) return; // Cooldown

      if (e.deltaY > 0) {
        // Scroll Down / Forward: check if current is watched
        if (activeIndex < SLIDES.length - 1) {
          if (!watchedSlidesRef.current[activeIndex]) return; // Locked!
          lastScrollTime = now;
          setActiveIndex((prev) => prev + 1);
        } else {
          // At the final slide, if they scroll down and have watched it, exit to the proposal page!
          if (watchedSlidesRef.current[activeIndex] && onScrollDownExit) {
            lastScrollTime = now;
            onScrollDownExit();
          }
        }
      } else if (e.deltaY < 0) {
        // Scroll Up / Backward
        if (activeIndex > 0) {
          lastScrollTime = now;
          setActiveIndex((prev) => prev - 1);
        } else {
          // Exit gallery
          if (onScrollUpExit) {
            lastScrollTime = now;
            onScrollUpExit();
          }
        }
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

      // Check if the swipe is mostly horizontal or vertical
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (diffX > 65) {
          // Swipe left -> advance (requires watch completion)
          if (activeIndex < SLIDES.length - 1) {
            if (!watchedSlidesRef.current[activeIndex]) return; // Gated!
            setActiveIndex((prev) => prev + 1);
            touchHasTriggered = true;
          } else {
            // At final slide, swipe left to exit to proposal page
            if (watchedSlidesRef.current[activeIndex] && onScrollDownExit) {
              onScrollDownExit();
              touchHasTriggered = true;
            }
          }
        } else if (diffX < -65) {
          // Swipe right -> previous or exit
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
            touchHasTriggered = true;
          } else {
            if (onScrollUpExit) {
              onScrollUpExit();
              touchHasTriggered = true;
            }
          }
        }
      } else {
        // Vertical Swipe (Swipe Up = Scroll Down, Swipe Down = Scroll Up)
        if (diffY > 65) {
          // Swipe Up (Scroll Down) -> advance or exit to proposal page
          if (activeIndex < SLIDES.length - 1) {
            if (!watchedSlidesRef.current[activeIndex]) return; // Gated!
            setActiveIndex((prev) => prev + 1);
            touchHasTriggered = true;
          } else {
            // At final slide, scroll down to exit to proposal page
            if (watchedSlidesRef.current[activeIndex] && onScrollDownExit) {
              onScrollDownExit();
              touchHasTriggered = true;
            }
          }
        } else if (diffY < -65) {
          // Swipe Down (Scroll Up) -> previous or exit to butterfly gallery
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
            touchHasTriggered = true;
          } else {
            if (onScrollUpExit) {
              onScrollUpExit();
              touchHasTriggered = true;
            }
          }
        }
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
  }, [activeIndex, onScrollUpExit]);

  return (
    <div className="video-gallery-root relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0d] text-white p-4">
      
      {/* Title */}
      <div className="flex flex-col items-center gap-2 mb-8 select-none text-center">
        <h2 className="font-serif italic text-3xl md:text-5xl text-white tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          Galerie D&apos;Art - Memories
        </h2>
        <span className="text-sm font-sans tracking-[0.15em] text-white opacity-95 uppercase font-medium">
          ✨ Click the photo to play video ✨
        </span>
      </div>

      {/* Options Container */}
      <div className="options flex flex-row items-stretch overflow-hidden w-full max-w-[900px] h-[450px] md:h-[480px]">
        {SLIDES.map((slide, idx) => {
          const isActive = activeIndex === idx;
          
          // Check if slide is unlocked (previous slides must be watched)
          let isUnlocked = true;
          for (let i = 0; i < idx; i++) {
            if (!watchedSlides[i]) {
              isUnlocked = false;
              break;
            }
          }

          return (
            <div
              key={idx}
              className={`option relative overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)] ${
                isActive ? "active flex-grow-[10000] max-w-[600px] rounded-[40px] margin-0" : "flex-grow rounded-[30px] margin-[10px]"
              } ${!isUnlocked ? "locked" : ""}`}
              style={{
                "--optionBackground": `url(${slide.thumbnail})`,
              } as React.CSSProperties}
              onClick={() => handleOptionClick(idx)}
            >
              {/* Background Shadow Gradient overlay */}
              <div className="shadow-overlay absolute inset-0 z-10 transition-all duration-500" />
              
              {/* Label & Details */}
              <div className={`label flex absolute right-0 transition-all duration-500 z-20 ${isActive ? "bottom-5 left-5" : "bottom-2.5 left-2.5"}`}>
                <div className="icon flex justify-center items-center min-w-[40px] max-w-[40px] h-[40px] rounded-full bg-white transition-all duration-300">
                  {isUnlocked ? slide.icon : <Lock size={16} className="text-neutral-500" />}
                </div>
                
                <div className="info flex flex-col justify-center ml-2.5 text-white whitespace-pre">
                  <div className="main font-bold text-lg leading-tight transition-all duration-500">
                    {slide.title}
                  </div>
                  <div className={`sub text-xs text-white/70 transition-all duration-500 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}`}>
                    {slide.sub}
                  </div>
                </div>
              </div>

              {/* Extended Slide Description & Play Action (Only when active) */}
              {isActive && (
                <div className="details-box absolute left-5 right-5 bottom-20 z-20 flex flex-col items-start gap-4 pr-4 pointer-events-auto select-text animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                  <p className="description text-xs md:text-sm text-slate-100 font-light leading-relaxed max-w-[500px] text-justify drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                    {slide.description}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <button
                      className="play-btn-cta flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-sans font-extrabold text-xs md:text-sm uppercase tracking-[0.12em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVideo(idx);
                      }}
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      ✦ CLICK ME TO PLAY VIDEO ✦
                    </button>

                    {/* Lock Status Text Indicator */}
                    <div className="text-[10px] font-sans font-bold tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {!watchedSlides[idx] ? (
                        <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                          🔒 Play video to unlock next memory
                        </span>
                      ) : idx < SLIDES.length - 1 ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          🔓 Unlocked! Next memory is ready
                        </span>
                      ) : (
                        <span className="text-pink-400 flex items-center gap-1.5">
                          ✨ Happy Birthday Ankita! ✨
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Hints */}
      <div className="scroll-hint absolute bottom-8 z-20 font-sans tracking-[0.2em] text-[10px] uppercase text-neutral-400 pointer-events-none select-none">
        Scroll / Swipe or Tap cards to explore
      </div>

      {/* Fullscreen Video Overlay */}
      {fullscreenVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 select-none pointer-events-auto animate-[fadeIn_0.3s_ease]">
          {/* Close button */}
          <button
            onClick={() => setFullscreenVideo(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50 shadow-md"
            aria-label="Close video player"
          >
            <X size={24} />
          </button>

          {/* Video Player Box */}
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black flex flex-col justify-end">
            <video
              src={fullscreenVideo}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Float download button */}
            <div className="absolute top-4 left-4 z-40">
              <a
                href={fullscreenVideo}
                download={`Ankita_Birthday_Video_${activeIndex + 1}.mp4`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-900 font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all shadow-lg pointer-events-auto"
                onClick={() => console.log("Downloading video:", fullscreenVideo)}
              >
                <Download size={14} />
                Download Video
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
