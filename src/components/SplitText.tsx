"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  tag?: string;
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text = "",
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const animationCompletedRef = useRef(false);

  useEffect(() => {
    if (!ref.current || !text) return;
    if (animationCompletedRef.current) return;

    const el = ref.current;
    const targets = el.querySelectorAll(".split-item");

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
    const sign =
      marginValue === 0
        ? ""
        : marginValue < 0
        ? `-=${Math.abs(marginValue)}${marginUnit}`
        : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    const tween = gsap.fromTo(
      targets,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
          fastScrollEnd: true,
          anticipatePin: 0.4,
        },
        onComplete: () => {
          animationCompletedRef.current = true;
          onLetterAnimationComplete?.();
        },
        willChange: "transform, opacity",
        force3D: true,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
      tween.kill();
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    JSON.stringify(from),
    JSON.stringify(to),
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  const Tag = tag as any;

  const style: React.CSSProperties = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  const renderContent = () => {
    if (splitType === "words") {
      return text.split(" ").map((word, idx) => (
        <span
          key={idx}
          className="split-word split-item inline-block"
          style={{ display: "inline-block", willChange: "transform, opacity" }}
        >
          {word}&nbsp;
        </span>
      ));
    }

    // Default: splitType === "chars"
    return text.split(" ").map((word, wordIdx) => (
      <span
        key={wordIdx}
        className="split-word inline-block"
        style={{ whiteSpace: "nowrap" }}
      >
        {word.split("").map((char, charIdx) => (
          <span
            key={charIdx}
            className="split-char split-item inline-block"
            style={{ display: "inline-block", willChange: "transform, opacity" }}
          >
            {char}
          </span>
        ))}
        &nbsp;
      </span>
    ));
  };

  return (
    <Tag ref={ref} style={style} className={`split-parent ${className}`}>
      {renderContent()}
    </Tag>
  );
}
