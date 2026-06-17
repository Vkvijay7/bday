"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./FriendsGallery.css";
import CurvedLoop from "./CurvedLoop";

// Import local images from the components/frnds folder
import frnd1 from "./frnds/1.jpeg";
import frnd2 from "./frnds/2.jpeg";
import frnd3 from "./frnds/3.jpeg";
import frnd4 from "./frnds/4.jpeg";
import frnd5 from "./frnds/5.jpeg";
import frnd6 from "./frnds/6.jpeg";
import frnd7 from "./frnds/7.jpeg";

const ASSETS = [
  { src: frnd1.src, title: "Special Moments" },
  { src: frnd2.src, title: "Good Times" },
  { src: frnd3.src, title: "Laughs & Smiles" },
  { src: frnd4.src, title: "Unforgettable Memories" },
  { src: frnd5.src, title: "Best Friends" },
  { src: frnd6.src, title: "Cherished Days" },
  { src: frnd7.src, title: "True Joy" },
];

/* ── PALETTE KEYFRAMES ── */
const KEYS = [
  {
    t: 0.0,
    name: "DAWN",
    skyTop: [38, 44, 86],
    skyHor: [247, 176, 128],
    sun: [255, 238, 206],
    glow: [255, 178, 120],
    wFar: [176, 150, 150],
    wNear: [34, 62, 84],
    foam: [255, 244, 234],
    sunH: 0.1,
    glit: 0.7,
    star: 0,
  },
  {
    t: 0.28,
    name: "MORNING",
    skyTop: [64, 134, 206],
    skyHor: [188, 222, 236],
    sun: [255, 255, 246],
    glow: [255, 250, 224],
    wFar: [120, 186, 196],
    wNear: [20, 92, 114],
    foam: [255, 255, 255],
    sunH: 0.55,
    glit: 0.5,
    star: 0,
  },
  {
    t: 0.5,
    name: "MIDDAY",
    skyTop: [58, 142, 214],
    skyHor: [176, 216, 230],
    sun: [255, 255, 248],
    glow: [255, 252, 232],
    wFar: [96, 178, 188],
    wNear: [16, 96, 120],
    foam: [255, 255, 255],
    sunH: 0.92,
    glit: 0.45,
    star: 0,
  },
  {
    t: 0.68,
    name: "GOLDEN HOUR",
    skyTop: [74, 92, 156],
    skyHor: [255, 202, 120],
    sun: [255, 236, 194],
    glow: [255, 168, 92],
    wFar: [206, 164, 118],
    wNear: [34, 78, 98],
    foam: [255, 244, 228],
    sunH: 0.3,
    glit: 0.95,
    star: 0,
  },
  {
    t: 0.84,
    name: "SUNSET",
    skyTop: [48, 38, 86],
    skyHor: [255, 108, 68],
    sun: [255, 206, 148],
    glow: [255, 92, 58],
    wFar: [188, 98, 84],
    wNear: [30, 42, 72],
    foam: [255, 222, 200],
    sunH: 0.06,
    glit: 1.0,
    star: 0.15,
  },
  {
    t: 1.0,
    name: "MOONLIT",
    skyTop: [8, 12, 30],
    skyHor: [34, 44, 82],
    sun: [228, 234, 255],
    glow: [140, 164, 216],
    wFar: [28, 42, 76],
    wNear: [6, 16, 32],
    foam: [196, 208, 234],
    sunH: 0.55,
    glit: 0.55,
    star: 1,
  },
];

function getPalette(t: number) {
  let i = 0;
  while (i < KEYS.length - 1 && t > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const span = b.t - a.t || 1;
  const k = Math.max(0, Math.min(1, (t - a.t) / span));
  return {
    name: k < 0.5 ? a.name : b.name,
  };
}

interface FriendsGalleryProps {
  sliderVal: number;
  setSliderVal: (val: number) => void;
  isAutoPlay: boolean;
  setIsAutoPlay: (val: boolean) => void;
}

export default function FriendsGallery({
  sliderVal,
  setSliderVal,
  setIsAutoPlay,
}: FriendsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(3);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    setIsAutoPlay(false); // Pause auto-play when user manually overrides the time
  };

  // Loop back and forth infinitely
  const toPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? ASSETS.length - 1 : prev - 1));
  };

  const toNext = () => {
    setActiveIndex((prev) => (prev === ASSETS.length - 1 ? 0 : prev + 1));
  };

  const toSlide = (index: number) => {
    setActiveIndex(index);
  };

  const P = getPalette(sliderVal / 1000);
  const hours = 5 + (sliderVal / 1000) * 18;
  const hh = Math.floor(hours) % 24;
  const mm = Math.floor((hours % 1) * 60);
  const timeString = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

  return (
    <div className="friends-gallery-root">
      {/* Curved loop marquee at the top */}
      <div className="absolute top-2 left-0 w-full h-[120px] pointer-events-none z-15 overflow-visible">
        <CurvedLoop
          marqueeText="HAPPY BIRTHDAY ANKITA ✦ "
          speed={1.5}
          curveAmount={120}
          direction="left"
          interactive={false}
          className="text-white/10 tracking-[0.1em]"
        />
      </div>

      {/* React Carousel Overlay */}
      <div className="carousel-center-container">
        <div className="carousel-wrap select-none text-white">
          {/* Carousel Wrapper */}
          <div className="w-[clamp(140px,70vmin,300px)] overflow-visible">
            {/* Slides Container */}
            <motion.div
              className="flex w-fit"
              animate={{ x: `${(-activeIndex * 100) / ASSETS.length}%` }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
            >
              {ASSETS.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <motion.div
                    key={i}
                    className="w-[clamp(140px,70vmin,300px)] aspect-square flex flex-col items-center gap-2 will-change-[transform,scale]"
                    animate={{
                      rotate: (i - activeIndex) * 20,
                      scale: isActive ? 1.05 : 0.65,
                      y: `${(i - activeIndex) * 20}%`,
                      z: isActive ? 50 : 0,
                    }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.7 }}
                  >
                    <div
                      className={`text-xs md:text-sm font-sans tracking-wider whitespace-nowrap mb-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs transition-all duration-300 ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75"
                      }`}
                    >
                      {item.title}
                    </div>

                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/20 cursor-pointer"
                      onClick={() => toSlide(i)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* High-Visibility Carousel Controls */}
          <div className="flex items-center gap-6 justify-center text-white rounded-full bg-black/45 px-6 py-2.5 backdrop-blur-md border border-white/20 shadow-xl mt-14 z-30 pointer-events-auto">
            {/* Prev Button */}
            <button
              onClick={toPrev}
              className="p-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-neutral-900 border border-white/10 transition-all duration-300 hover:scale-115 active:scale-95 shadow-md cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Slide Dots */}
            <div className="flex justify-center items-center gap-2.5 min-w-[130px]">
              {ASSETS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => toSlide(i)}
                  className={`rounded-full cursor-pointer h-2 transition-all duration-300 ${
                    activeIndex === i
                      ? "w-7 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={toNext}
              className="p-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-neutral-900 border border-white/10 transition-all duration-300 hover:scale-115 active:scale-95 shadow-md cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* Ocean UI Controls */}
      <div className="ui">
        <div className="ui-top">
          <div className="label">◑ &nbsp;F R N D S</div>
          <div className="mood">
            <span id="mood-name">{P.name}</span>
            <span className="mood-time" id="mood-time">
              {timeString}
            </span>
          </div>
        </div>

        <div className="ui-bottom">
          <p className="caption">
            Same sea — <em>every hour a different blue.</em>
          </p>

          <div className="slider-wrap">
            <span className="slider-end">DAWN</span>
            <input
              type="range"
              id="time"
              min="0"
              max="1000"
              value={sliderVal}
              onChange={handleSliderChange}
            />
            <span className="slider-end">NIGHT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
