"use client";

import React, { useId } from "react";
import "./SmookyButton.css";

interface SmookyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text1: string; // The text shown normally (which slides up on hover)
  text2: string; // The text shown on hover (which slides up from bottom)
  theme?: "blue" | "red" | "purple" | "cyan";
  className?: string;
}

export default function SmookyButton({
  text1,
  text2,
  theme = "red",
  className = "",
  onClick,
  ...props
}: SmookyButtonProps) {
  const gradientId = `smooky-grad-${useId().replace(/:/g, "")}`;

  // Theme map to resolve styles
  const themeClasses = {
    red: {
      btn: "bg-gradient-to-r from-red-500 to-orange-500 shadow-red-600/50 group-hover:shadow-red-600/80 after:bg-red-200",
      text1: "from-red-500 to-orange-500",
      text2: "from-red-700 to-orange-700",
      wave2: "fill-red-500",
      gradStart: "hsl(37, 99%, 67%)",
      gradEnd: "hsl(316, 73%, 52%)",
    },
    blue: {
      btn: "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-600/50 group-hover:shadow-blue-600/80 after:bg-blue-100",
      text1: "from-blue-500 to-cyan-500",
      text2: "from-blue-700 to-cyan-700",
      wave2: "fill-blue-500",
      gradStart: "hsl(200, 99%, 67%)",
      gradEnd: "hsl(225, 90%, 55%)",
    },
    purple: {
      btn: "bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-600/50 group-hover:shadow-purple-600/80 after:bg-purple-100",
      text1: "from-purple-500 to-pink-500",
      text2: "from-purple-700 to-pink-700",
      wave2: "fill-purple-500",
      gradStart: "hsl(270, 99%, 67%)",
      gradEnd: "hsl(320, 73%, 52%)",
    },
    cyan: {
      btn: "bg-gradient-to-r from-cyan-400 to-teal-500 shadow-cyan-600/50 group-hover:shadow-cyan-600/80 after:bg-cyan-100",
      text1: "from-cyan-400 to-teal-500",
      text2: "from-cyan-600 to-teal-700",
      wave2: "fill-cyan-500",
      gradStart: "hsl(180, 99%, 67%)",
      gradEnd: "hsl(160, 73%, 52%)",
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.red;

  // Render text placeholder matching the longest word for size stability
  const placeholderText = text1.length > text2.length ? text1 : text2;

  return (
    <button
      style={{
        WebkitBoxReflect: "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4))",
      }}
      className={`smooky-button px-14 py-5 md:px-16 md:py-6 rounded-full shadow-lg group-hover:shadow-2xl uppercase tracking-widest relative overflow-hidden group text-transparent cursor-pointer z-10 hover:saturate-[1.15] active:saturate-[1.4] transition-all duration-300 ${currentTheme.btn} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Invisible text for natural size sizing */}
      <span className="font-sans font-extrabold text-sm md:text-base select-none opacity-0">{placeholderText}</span>

      {/* Top Text (Slides up/out on hover) */}
      <p
        className="absolute z-40 font-bold text-white text-sm md:text-base drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] group-hover:-translate-y-full w-full text-center transition-all duration-300 tracking-widest"
      >
        {text1}
      </p>

      {/* Bottom Text (Slides up/in on hover) */}
      <p
        className="absolute z-40 font-extrabold text-sm md:text-base drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)] top-1/2 left-1/2 -translate-x-1/2 translate-y-full w-full text-center transition-all duration-300 group-hover:-translate-y-[48%] tracking-widest"
      >
        {text2}
      </p>

      {/* Background wave layer 1 */}
      <svg
        className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300 pointer-events-none"
        viewBox="0 0 2400 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} y2="100%" x2="50%" y1="0%" x1="50%">
            <stop offset="0%" stopOpacity="1" stopColor={currentTheme.gradStart}></stop>
            <stop offset="100%" stopOpacity="1" stopColor={currentTheme.gradEnd}></stop>
          </linearGradient>
        </defs>
        <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill={`url(#${gradientId})`}>
          <path
            opacity="0.05"
            transform="matrix(1,0,0,1,0,35)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
          <path
            opacity="0.21"
            transform="matrix(1,0,0,1,0,70)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
          <path
            opacity="0.37"
            transform="matrix(1,0,0,1,0,105)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
          <path
            opacity="0.53"
            transform="matrix(1,0,0,1,0,140)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
          <path
            opacity="0.68"
            transform="matrix(1,0,0,1,0,175)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
          <path
            opacity="0.84"
            transform="matrix(1,0,0,1,0,210)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
          <path
            opacity="1"
            transform="matrix(1,0,0,1,0,245)"
            d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
          ></path>
        </g>
      </svg>

      {/* Background wave layer 2 */}
      <svg
        className={`absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-40 pointer-events-none ${currentTheme.wave2}`}
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320L1430.8,320C1421.5,320,1403,320,1385,320C1366.2,320,1348,320,1329,320C1310.8,320,1292,320,1274,320C1255.4,320,1237,320,1218,320C1200,320,1182,320,1163,320C1144.6,320,1126,320,1108,320C1089.2,320,1071,320,1052,320C1033.8,320,1015,320,997,320C978.5,320,960,320,942,320C923.1,320,905,320,886,320C867.7,320,849,320,831,320C812.3,320,794,320,775,320C756.9,320,738,320,720,320C701.5,320,683,320,665,320C646.2,320,628,320,609,320C590.8,320,572,320,554,320C535.4,320,517,320,498,320C480,320,462,320,443,320C424.6,320,406,320,388,320C369.2,320,351,320,332,320C313.8,320,295,320,277,320C258.5,320,240,320,222,320C203.1,320,185,320,166,320C147.7,320,129,320,111,320C92.3,320,74,320,55,320C36.9,320,18,320,9,320L0,320Z"
          fillOpacity="1"
        ></path>
      </svg>
    </button>
  );
}
