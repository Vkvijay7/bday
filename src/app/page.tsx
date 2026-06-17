"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import FlightCanvas from "@/components/FlightCanvas";
import FlightOverlay from "@/components/FlightOverlay";
import FloatingHearts from "@/components/FloatingHearts";
import ShinyText from "@/components/ShinyText";
import DomeGallery from "@/components/DomeGallery";
import FriendsGallery from "@/components/FriendsGallery";
import OceanCanvas from "@/components/OceanCanvas";
import SplitText from "@/components/SplitText";
import SmookyButton from "@/components/SmookyButton";
import ButterflyGallery from "@/components/ButterflyGallery";
import VideoGallery from "@/components/VideoGallery";
import ProposalPage from "@/components/ProposalPage";

import img1 from "@/components/DOME/1.jpeg";
import img2 from "@/components/DOME/2.jpeg";
import img3 from "@/components/DOME/3.jpeg";
import img4 from "@/components/DOME/4.jpeg";
import img5 from "@/components/DOME/5.jpeg";
import img6 from "@/components/DOME/6.jpeg";
import img7 from "@/components/DOME/7.jpeg";
import img8 from "@/components/DOME/8.jpeg";
import img9 from "@/components/DOME/9.jpeg";
import img10 from "@/components/DOME/10.jpeg";
import img11 from "@/components/DOME/11.jpeg";
import img12 from "@/components/DOME/12.jpeg";
import img13 from "@/components/DOME/13.jpeg";
import img14 from "@/components/DOME/14.jpeg";
import img15 from "@/components/DOME/15.jpeg";
import img16 from "@/components/DOME/16.jpeg";
import img17 from "@/components/DOME/17.jpeg";
import img18 from "@/components/DOME/18.jpeg";
import img19 from "@/components/DOME/19.jpeg";
import img20 from "@/components/DOME/20.jpeg";
import img21 from "@/components/DOME/21.jpeg";
import img22 from "@/components/DOME/22.jpeg";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [journeyEnded, setJourneyEnded] = useState(false);
  const [showSpiral, setShowSpiral] = useState(false);
  const [showButterfly, setShowButterfly] = useState(false);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [sliderVal, setSliderVal] = useState(600);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showQuote, setShowQuote] = useState(false);

  const lastTransitionTimeRef = useRef(0);

  // Auto-play day/night cycle
  useEffect(() => {
    if (!isAutoPlay || !journeyEnded) return;

    const interval = setInterval(() => {
      setSliderVal((prev) => (prev + 1) % 1001);
    }, 60);

    return () => clearInterval(interval);
  }, [isAutoPlay, journeyEnded]);

  // Reset auto-play after 8 seconds of user inactivity
  useEffect(() => {
    if (isAutoPlay) return;

    const timer = setTimeout(() => {
      setIsAutoPlay(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isAutoPlay]);
  
  // Custom images to populate the 3D Dome Gallery on the final screen.
  const galleryImages = [
    { src: img1.src, alt: "Memory 1" },
    { src: img2.src, alt: "Memory 2" },
    { src: img3.src, alt: "Memory 3" },
    { src: img4.src, alt: "Memory 4" },
    { src: img5.src, alt: "Memory 5" },
    { src: img6.src, alt: "Memory 6" },
    { src: img7.src, alt: "Memory 7" },
    { src: img8.src, alt: "Memory 8" },
    { src: img9.src, alt: "Memory 9" },
    { src: img10.src, alt: "Memory 10" },
    { src: img11.src, alt: "Memory 11" },
    { src: img12.src, alt: "Memory 12" },
    { src: img13.src, alt: "Memory 13" },
    { src: img14.src, alt: "Memory 14" },
    { src: img15.src, alt: "Memory 15" },
    { src: img16.src, alt: "Memory 16" },
    { src: img17.src, alt: "Memory 17" },
    { src: img18.src, alt: "Memory 18" },
    { src: img19.src, alt: "Memory 19" },
    { src: img20.src, alt: "Memory 20" },
    { src: img21.src, alt: "Memory 21" },
    { src: img22.src, alt: "Memory 22" },
  ];
  


  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);

  const cardRefs = {
    1: card1Ref,
    2: card2Ref,
    3: card3Ref,
  };

  const targetProgressRef = useRef(0);
  const scrollStateRef = useRef({ progress: 0 });

  // Bind virtual scroll events (wheel & touch swipe) to update progress smoothly via GSAP (Phase 3)
  useEffect(() => {
    if (!hasStarted) return;

    const state = scrollStateRef.current;
    let activeTween: gsap.core.Tween | null = null;

    const updateScrollProgress = (delta: number) => {
      if (showVideoGallery || showProposal) {
        // Let VideoGallery or ProposalPage handle their own scrolls and exits
        return;
      }

      if (journeyEnded) {
        const now = Date.now();
        const cooldown = 800; // ms

        // 2. Butterfly Page Scroll Handling
        if (showButterfly) {
          if (delta > 0) {
            // Scroll down to Video Exhibition Gallery
            if (now - lastTransitionTimeRef.current > cooldown) {
              lastTransitionTimeRef.current = now;
              setShowButterfly(false);
              setShowVideoGallery(true);
            }
          } else if (delta < 0) {
            // Scroll up to Friends Gallery
            if (now - lastTransitionTimeRef.current > cooldown) {
              lastTransitionTimeRef.current = now;
              setShowButterfly(false);
              setShowSpiral(true);
            }
          }
          return;
        }

        // 3. Friends Gallery (Spiral) Scroll Handling
        if (showSpiral) {
          if (delta > 0) {
            // Scroll down to Butterfly Page
            if (now - lastTransitionTimeRef.current > cooldown) {
              lastTransitionTimeRef.current = now;
              setShowSpiral(false);
              setShowButterfly(true);
            }
          } else if (delta < 0) {
            // Scroll up to Quotes Screen
            if (now - lastTransitionTimeRef.current > cooldown) {
              lastTransitionTimeRef.current = now;
              setShowSpiral(false);
              setShowQuote(true);
            }
          }
          return;
        }

        // 4. Friendship Quotes Screen Scroll Handling
        if (showQuote) {
          if (delta > 0) {
            // Scroll down to Friends Gallery
            if (now - lastTransitionTimeRef.current > cooldown) {
              lastTransitionTimeRef.current = now;
              setShowSpiral(true);
              setShowQuote(false);
            }
          } else if (delta < 0) {
            // Scroll up to Dome Page
            if (now - lastTransitionTimeRef.current > cooldown) {
              lastTransitionTimeRef.current = now;
              setShowQuote(false);
            }
          }
          return;
        }

        // 4. Dome Page Scroll Handling (Quotes, Spiral, Butterfly are false)
        if (delta > 0) {
          // Scroll down to Quotes Screen
          if (now - lastTransitionTimeRef.current > cooldown) {
            lastTransitionTimeRef.current = now;
            setShowQuote(true);
          }
          return;
        } else if (delta < 0) {
          // Prevent accidental drags/swipes on the Dome Gallery from going back to the flight screen
          return;
        }
      }

      // Sensitivity factor: delta is around 100 for wheel scroll
      const sensitivity = 0.00065;
      targetProgressRef.current = Math.min(1, Math.max(0, targetProgressRef.current + delta * sensitivity));

      if (activeTween) activeTween.kill();

      activeTween = gsap.to(state, {
        progress: targetProgressRef.current,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          setScrollProgress(state.progress);
          if (state.progress >= 0.97) {
            setJourneyEnded(true);
          } else {
            setJourneyEnded(false);
            setShowQuote(false);
            setShowSpiral(false);
            setShowButterfly(false);
            setShowVideoGallery(false);
          }
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (showVideoGallery) {
        // Let VideoGallery receive scroll events directly without preventDefault
        return;
      }
      e.preventDefault(); // Stop native scrolling
      updateScrollProgress(e.deltaY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (showVideoGallery) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (showVideoGallery) return;
      // Stop native page scrolling on mobile
      if (e.cancelable) {
        e.preventDefault();
      }
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY; // Swipe up increases progress
      touchStartY = currentY;
      updateScrollProgress(deltaY * 3.5); // Swipe gestures need higher multiplier
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (activeTween) activeTween.kill();
    };
  }, [hasStarted, journeyEnded, showQuote, showSpiral, showButterfly, showVideoGallery]);



  const handleStartJourney = () => {
    setHasStarted(true);
  };

  return (
    <div className="relative h-screen w-screen text-white overflow-hidden select-none">
      {/* 1. Fixed Viewport Sky Gradient Background (Fallback / Underlay) */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#003bde] via-[#598cff] to-[#ffffff] z-[-2] pointer-events-none h-screen w-screen" />
      
      {/* 2. Premium SVG Grain Texture Noise Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.035] z-50 pointer-events-none mix-blend-overlay h-screen w-screen bg-repeat" 
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)'/></svg>")`
        }}
      />

      {/* Shared Ocean Waves Background */}
      {(journeyEnded || showSpiral) && (
        <OceanCanvas sliderVal={sliderVal} />
      )}

      {/* Floating background sparkles (visible everywhere except end backdrop) */}
      {!journeyEnded && <FloatingHearts />}

      {/* 3. Atmos Header Navigation bar (visible once flight has started) */}
      {hasStarted && !journeyEnded && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed top-6 left-0 w-full px-6 md:px-12 flex items-center justify-between z-30 select-none pointer-events-none"
        >
          {/* Top-Left: Spacer to center title */}
          <div className="w-16 hidden md:block" />
          
          {/* Center Title */}
          <h2 className="text-xl md:text-2xl font-serif tracking-[0.3em] font-light text-white pointer-events-auto cursor-default">
            ANKITA
          </h2>
          
          {/* Top-Right: About link */}
          <a
            href="#about"
            className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-white/70 hover:text-white pointer-events-auto transition-colors"
          >
            About
          </a>
        </motion.header>
      )}

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          /* Landing Screen */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center z-30"
          >
            <div className="flex flex-col gap-6 max-w-2xl items-center relative">
              {/* Spinning badge */}
              <div className="absolute -top-16 right-0 translate-x-[40%] hidden md:block select-none pointer-events-none">
                <div className="relative w-28 h-28 flex items-center justify-center animate-[spin_12s_linear_infinite]">
                  <svg className="w-full h-full text-white/30" viewBox="0 0 100 100">
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[8px] font-bold uppercase tracking-widest fill-current">
                      <textPath href="#circlePath">The Surreal Flight Experiment - </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              <h1 className="text-6xl md:text-9xl font-serif tracking-normal font-light leading-none mb-4 uppercase drop-shadow-sm select-none">
                <ShinyText
                  text="Welcome Ankita"
                  speed={3.5}
                  color="rgba(255, 255, 255, 0.75)"
                  shineColor="#ffffff"
                  spread={90}
                />
              </h1>

              <SmookyButton
                text1="START"
                text2="JOURNEY"
                theme="blue"
                onClick={handleStartJourney}
              />
            </div>
          </motion.div>
        ) : (
          /* Interactive Flight Screen */
          <motion.div
            key="flight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.8 } }}
            className="relative"
          >
            {/* Virtual Scrolling Mode (no native height spacer) */}

            {/* 3D WebGL Background Canvas Container */}
            <div className="fixed inset-0 z-0 h-screen w-screen pointer-events-none">
              <FlightCanvas
                scrollProgress={scrollProgress}
                cardRefs={cardRefs}
              />
            </div>

            {/* HTML Layer Overlay for Memory Cards */}
            <div className="fixed inset-0 z-10 h-screen w-screen pointer-events-none">
              <FlightOverlay cardRefs={cardRefs} />
            </div>

            {/* Progress Bar Indicator at the top (styled in white/blue) */}
            {!journeyEnded && (
              <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 backdrop-blur-xs z-30">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            )}

            {/* Flashing scroll prompt helper */}
            {scrollProgress < 0.15 && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50 animate-bounce pointer-events-none">
                <span className="text-[10px] uppercase font-sans font-bold tracking-[0.2em]">Scroll to begin the journey</span>
                <ArrowDown className="h-4 w-4" />
              </div>
            )}

            {/* End of Journey Transition: Smoothly cover the screen with a clean white-blue backdrop and show birthday surprise */}
            <AnimatePresence>
              {journeyEnded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="fixed inset-0 z-45 bg-transparent flex flex-col items-center justify-center p-6 pointer-events-auto"
                >
                  {/* 3D Dome Gallery Background */}
                  <div className={`absolute inset-0 z-0 w-full h-full transition-all duration-700 ${(showSpiral || showQuote || showButterfly || showVideoGallery) ? "opacity-0 pointer-events-none scale-95" : "opacity-100"}`}>
                    <DomeGallery
                      images={galleryImages}
                      fit={0.65}
                      minRadius={400}
                      overlayBlurColor="rgba(6, 8, 15, 0.55)"
                      grayscale={false}
                      openedImageWidth="300px"
                      openedImageHeight="400px"
                      imageBorderRadius="12px"
                      openedImageBorderRadius="20px"
                      dragDampening={1.5}
                      dragSensitivity={15}
                    />
                  </div>

                  {!showQuote && !showSpiral && !showButterfly && !showVideoGallery && (
                    <>
                      {/* Header replicate styled for dark background */}
                      <div className="absolute top-6 left-0 w-full px-6 md:px-12 flex items-center justify-between z-50 pointer-events-none select-none">
                        {/* Top-Left: Spacer to center title */}
                        <div className="w-16 hidden md:block" />
                        <h2 className="text-xl md:text-2xl font-serif tracking-[0.3em] font-light text-white">
                          ANKITA
                        </h2>
                        <span className="w-12" /> {/* Spacer */}
                      </div>

                      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 text-[10px] uppercase font-sans font-bold tracking-[0.3em] text-white animate-pulse text-center pointer-events-none select-none flex flex-col gap-1.5">
                        <span>✨ Drag left or right to explore ✨</span>
                        <span>📸 Click photo to preview 📸</span>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto select-none">
                        {/* Try Again Button */}
                        <SmookyButton
                          text1="START"
                          text2="OVER"
                          theme="blue"
                          onClick={() => {
                            scrollStateRef.current.progress = 0;
                            targetProgressRef.current = 0;
                            setScrollProgress(0);
                            setJourneyEnded(false);
                          }}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote Transition Screen Overlay */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[55] bg-transparent flex flex-col items-center justify-center p-6 pointer-events-auto select-none"
          >
            <SplitText
              text="True friendship is a journey that lasts a lifetime. Happy Birthday Ankita! ✦"
              className="font-serif text-2xl md:text-4xl text-center text-white max-w-3xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              delay={35}
              duration={0.8}
              splitType="chars"
            />

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 animate-bounce pointer-events-none">
              <span className="text-[10px] uppercase font-sans font-bold tracking-[0.2em]">Scroll down to see memories</span>
              <ArrowDown className="h-4 w-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spiral Gallery Overlay */}
      <AnimatePresence>
        {showSpiral && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] bg-transparent"
          >
            <FriendsGallery
              sliderVal={sliderVal}
              setSliderVal={setSliderVal}
              isAutoPlay={isAutoPlay}
              setIsAutoPlay={setIsAutoPlay}
            />

            {/* Back Button */}
            <SmookyButton
              text1="GO"
              text2="BACK"
              theme="blue"
              onClick={() => {
                lastTransitionTimeRef.current = Date.now();
                setShowSpiral(false);
                setShowQuote(false);
              }}
              className="fixed top-6 left-6 z-[70] scale-90 md:scale-100 origin-top-left shadow-none hover:shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Butterfly Gallery Overlay */}
      <AnimatePresence>
        {showButterfly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-[65] bg-transparent"
          >
            <ButterflyGallery />

            {/* Back Button */}
            <SmookyButton
              text1="GO"
              text2="BACK"
              theme="blue"
              onClick={() => {
                lastTransitionTimeRef.current = Date.now();
                setShowButterfly(false);
                setShowSpiral(true);
              }}
              className="fixed top-6 left-6 z-[75] scale-90 md:scale-100 origin-top-left shadow-none hover:shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Gallery Overlay */}
      <AnimatePresence>
        {showVideoGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-[70] bg-transparent"
          >
            <VideoGallery
              onScrollUpExit={() => {
                lastTransitionTimeRef.current = Date.now();
                setShowVideoGallery(false);
                setShowButterfly(true);
              }}
              onScrollDownExit={() => {
                lastTransitionTimeRef.current = Date.now();
                setShowVideoGallery(false);
                setShowProposal(true);
              }}
            />

            {/* Back Button */}
            <SmookyButton
              text1="GO"
              text2="BACK"
              theme="blue"
              onClick={() => {
                lastTransitionTimeRef.current = Date.now();
                setShowVideoGallery(false);
                setShowButterfly(true);
              }}
              className="fixed top-6 left-6 z-[75] scale-90 md:scale-100 origin-top-left shadow-none hover:shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposal Gallery Overlay */}
      <AnimatePresence>
        {showProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-[80] bg-transparent"
          >
            <ProposalPage
              onBackClick={() => {
                lastTransitionTimeRef.current = Date.now();
                setShowProposal(false);
                setShowVideoGallery(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

