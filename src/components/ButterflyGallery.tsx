"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ButterflyGallery.css";

// Import images from local butterfly folder
import img1 from "./butterfly/1.jpeg";
import img2 from "./butterfly/2.jpeg";
import img3 from "./butterfly/3.jpeg";
import img4 from "./butterfly/4.jpeg";
import img5 from "./butterfly/5.jpeg";
import img6 from "./butterfly/6.jpeg";

const DATA = [
  {
    place: "Chrysalis of Grace",
    title: "COCOON OF",
    title2: "GRACE",
    description: "True friendship, like a cocoon, keeps us safe in the quiet times and gives us the wings to fly when we are ready. Ankita, you've always been that safe space.",
    image: img1.src
  },
  {
    place: "Metamorphosis",
    title: "BEAUTIFUL",
    title2: "METAMORPHOSIS",
    description: "No matter how far we travel or how much we grow, our bond changes beautifully but never fades. Happy birthday to my favorite butterfly!",
    image: img2.src
  },
  {
    place: "Dancing Wings",
    title: "LIVELY",
    title2: "LAUGHTER",
    description: "Your laughter is like butterfly wings—light, colorful, and capable of carrying away all the heavy clouds in my sky. Here's to endless more smiles.",
    image: img3.src
  },
  {
    place: "Golden Cocoon",
    title: "GOLDEN",
    title2: "MEMORIES",
    description: "In the scrapbook of my heart, the golden moments of us talking, sharing secrets, and dreaming together shine the brightest. Love you always!",
    image: img4.src
  },
  {
    place: "Soaring Skyward",
    title: "FLYING",
    title2: "TOGETHER",
    description: "I'm so incredibly lucky to fly through the winds of life beside a friend as wonderful, patient, and loving as you. You make the world dynamic.",
    image: img5.src
  },
  {
    place: "Painted Horizons",
    title: "BRIGHTER",
    title2: "TOMORROWS",
    description: "As you begin another beautiful year, may your wings carry you to new horizons and paint your life with the brightest shades of joy and success.",
    image: img6.src
  }
];

const ease = "sine.inOut";

function getCard(index: number) {
  return `#card${index}`;
}
function getCardContent(index: number) {
  return `#card-content-${index}`;
}
function getSliderItem(index: number) {
  return `#slide-item-${index}`;
}

export default function ButterflyGallery() {
  const orderRef = useRef([0, 1, 2, 3, 4, 5]);
  const detailsEvenRef = useRef(true);
  const isTransitioning = useRef(false);
  const indicatorTimeline = useRef<gsap.core.Timeline | null>(null);
  const isPausedByUser = useRef(false);

  // Layout Refs
  const cardWidthRef = useRef(200);
  const cardHeightRef = useRef(300);
  const gapRef = useRef(40);
  const numberSizeRef = useRef(50);
  const offsetTopRef = useRef(200);
  const offsetLeftRef = useRef(700);

  const init = () => {
    const [active, ...rest] = orderRef.current;
    const detailsActive = detailsEvenRef.current ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEvenRef.current ? "#details-odd" : "#details-even";

    const height = window.innerHeight;
    const width = window.innerWidth;

    // Responsive dimensions
    let cWidth = 200;
    let cHeight = 300;
    let cGap = 40;
    let numSize = 50;
    let oTop = height - 430;
    let oLeft = width - 830;

    if (width < 800) {
      cWidth = 90;
      cHeight = 130;
      cGap = 12;
      numSize = 30;
      oTop = height - 220; // Shift thumbnails up to clear the bottom on tablet
      oLeft = width - 400;
    }
    if (width < 480) {
      cWidth = 70;
      cHeight = 100;
      cGap = 8;
      oLeft = width - 300;
      oTop = height - 190; // Shift thumbnails up to clear the bottom on mobile
    }

    cardWidthRef.current = cWidth;
    cardHeightRef.current = cHeight;
    gapRef.current = cGap;
    numberSizeRef.current = numSize;
    offsetTopRef.current = oTop;
    offsetLeftRef.current = oLeft;

    gsap.set("#pagination", {
      top: oTop + (width < 800 ? (width < 480 ? 120 : 145) : 330), // Account for smaller buttons and higher oTop on mobile/tablet
      left: oLeft,
      y: 200,
      opacity: 0,
      zIndex: 60
    });

    gsap.set(getCard(active), {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      scale: 1,
      zIndex: 20
    });
    gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    
    gsap.set(`${detailsInactive} .text`, { y: 100 });
    gsap.set(`${detailsInactive} .title-1`, { y: 100 });
    gsap.set(`${detailsInactive} .title-2`, { y: 100 });
    gsap.set(`${detailsInactive} .desc`, { y: 50 });
    gsap.set(`${detailsInactive} .cta`, { y: 60 });

    gsap.set(".progress-sub-foreground", {
      width: (width < 800 ? 180 : 500) * (1 / orderRef.current.length) * (active + 1)
    });

    rest.forEach((i, index) => {
      gsap.set(getCard(i), {
        x: oLeft + 400 + index * (cWidth + cGap),
        y: oTop,
        width: cWidth,
        height: cHeight,
        zIndex: 30,
        borderRadius: 10,
        scale: 1
      });
      gsap.set(getCardContent(i), {
        x: oLeft + 400 + index * (cWidth + cGap),
        zIndex: 40,
        y: oTop + cHeight - 100,
        opacity: 1
      });
      gsap.set(getSliderItem(i), { x: (index + 1) * numSize });
    });

    gsap.set(".indicator", { x: -window.innerWidth });

    const startDelay = 0.6;

    gsap.to(".cover", {
      x: width + 400,
      duration: 0.8,
      ease,
      delay: 0.5,
      onComplete: () => {
        runAutoPlay();
      }
    });

    rest.forEach((i, index) => {
      gsap.to(getCard(i), {
        x: oLeft + index * (cWidth + cGap),
        zIndex: 30,
        ease,
        delay: startDelay + 0.05 * index
      });
      gsap.to(getCardContent(i), {
        x: oLeft + index * (cWidth + cGap),
        zIndex: 40,
        ease,
        delay: startDelay + 0.05 * index
      });
    });

    gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
  };

  const step = (direction: "next" | "prev"): Promise<void> => {
    return new Promise((resolve) => {
      isTransitioning.current = true;

      if (direction === "next") {
        orderRef.current.push(orderRef.current.shift()!);
      } else {
        orderRef.current.unshift(orderRef.current.pop()!);
      }

      detailsEvenRef.current = !detailsEvenRef.current;

      const detailsActive = detailsEvenRef.current ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEvenRef.current ? "#details-odd" : "#details-even";

      const activeSlideData = DATA[orderRef.current[0]];

      // Update contents of text cards
      const activeText = document.querySelector(`${detailsActive} .place-box .text`);
      const activeTitle1 = document.querySelector(`${detailsActive} .title-1`);
      const activeTitle2 = document.querySelector(`${detailsActive} .title-2`);
      const activeDesc = document.querySelector(`${detailsActive} .desc`);

      if (activeText) activeText.textContent = activeSlideData.place;
      if (activeTitle1) activeTitle1.textContent = activeSlideData.title;
      if (activeTitle2) activeTitle2.textContent = activeSlideData.title2;
      if (activeDesc) activeDesc.textContent = activeSlideData.description;

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, duration: 0.4, ease });
      
      gsap.set(`${detailsActive} .place-box .text`, { y: 100 });
      gsap.set(`${detailsActive} .title-1`, { y: 100 });
      gsap.set(`${detailsActive} .title-2`, { y: 100 });
      gsap.set(`${detailsActive} .desc`, { y: 50 });
      gsap.set(`${detailsActive} .cta`, { y: 60 });

      gsap.to(`${detailsActive} .place-box .text`, { y: 0, delay: 0.1, duration: 0.7, ease });
      gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease });
      gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease });
      gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease });
      gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.35, duration: 0.4, ease });

      gsap.set(detailsInactive, { zIndex: 12 });
      gsap.to(detailsInactive, { opacity: 0, duration: 0.4, ease });

      const [active, ...rest] = orderRef.current;
      const width = window.innerWidth;

      // Update progress bar width
      const barWidth = width < 800 ? 180 : 500;
      gsap.to(".progress-sub-foreground", {
        width: barWidth * (1 / orderRef.current.length) * (active + 1),
        duration: 0.8,
        ease
      });

      const cWidth = cardWidthRef.current;
      const cHeight = cardHeightRef.current;
      const cGap = gapRef.current;
      const numSize = numberSizeRef.current;
      const oTop = offsetTopRef.current;
      const oLeft = offsetLeftRef.current;

      if (direction === "next") {
        const prv = rest[rest.length - 1]; // old active card

        gsap.set(getCard(prv), { zIndex: 10 });
        gsap.set(getCard(active), { zIndex: 20 });
        gsap.to(getCard(prv), { scale: 1.5, duration: 0.8, ease });

        gsap.to(getCardContent(active), {
          y: oTop + cHeight - 10,
          opacity: 0,
          duration: 0.3,
          ease
        });
        
        gsap.to(getSliderItem(active), { x: 0, duration: 0.8, ease });
        gsap.to(getSliderItem(prv), { x: -numSize, duration: 0.8, ease });

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.8,
          ease,
          onComplete: () => {
            const xNew = oLeft + (rest.length - 1) * (cWidth + cGap);
            gsap.set(getCard(prv), {
              x: xNew,
              y: oTop,
              width: cWidth,
              height: cHeight,
              zIndex: 30,
              borderRadius: 10,
              scale: 1
            });

            gsap.set(getCardContent(prv), {
              x: xNew,
              y: oTop + cHeight - 100,
              opacity: 1,
              zIndex: 40
            });
            gsap.set(getSliderItem(prv), { x: rest.length * numSize });

            gsap.set(detailsInactive, { opacity: 0 });
            gsap.set(`${detailsInactive} .place-box .text`, { y: 100 });
            gsap.set(`${detailsInactive} .title-1`, { y: 100 });
            gsap.set(`${detailsInactive} .title-2`, { y: 100 });
            gsap.set(`${detailsInactive} .desc`, { y: 50 });
            gsap.set(`${detailsInactive} .cta`, { y: 60 });
            
            isTransitioning.current = false;
            resolve();
          }
        });

        rest.forEach((i, index) => {
          if (i !== prv) {
            const xNew = oLeft + index * (cWidth + cGap);
            gsap.set(getCard(i), { zIndex: 30 });
            gsap.to(getCard(i), {
              x: xNew,
              y: oTop,
              width: cWidth,
              height: cHeight,
              duration: 0.8,
              ease,
              delay: 0.1 * (index + 1)
            });

            gsap.to(getCardContent(i), {
              x: xNew,
              y: oTop + cHeight - 100,
              opacity: 1,
              zIndex: 40,
              duration: 0.8,
              ease,
              delay: 0.1 * (index + 1)
            });
            gsap.to(getSliderItem(i), { x: (index + 1) * numSize, duration: 0.8, ease });
          }
        });

      } else {
        // PREV DIRECTION
        const oldActive = rest[0]; // the card that was active before unshift

        gsap.set(getCard(active), { zIndex: 20 });
        gsap.set(getCard(oldActive), { zIndex: 15 });

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.8,
          ease,
          onComplete: () => {
            isTransitioning.current = false;
            resolve();
          }
        });

        gsap.to(getCard(oldActive), {
          x: oLeft,
          y: oTop,
          width: cWidth,
          height: cHeight,
          borderRadius: 10,
          scale: 1,
          duration: 0.8,
          ease
        });
        gsap.to(getCardContent(oldActive), {
          x: oLeft,
          y: oTop + cHeight - 100,
          opacity: 1,
          zIndex: 40,
          duration: 0.8,
          ease
        });

        rest.forEach((i, index) => {
          if (i !== oldActive) {
            const xNew = oLeft + index * (cWidth + cGap);
            gsap.set(getCard(i), { zIndex: 30 });
            gsap.to(getCard(i), {
              x: xNew,
              y: oTop,
              width: cWidth,
              height: cHeight,
              duration: 0.8,
              ease,
              delay: 0.05 * index
            });

            gsap.to(getCardContent(i), {
              x: xNew,
              y: oTop + cHeight - 100,
              opacity: 1,
              zIndex: 40,
              duration: 0.8,
              ease,
              delay: 0.05 * index
            });
            gsap.to(getSliderItem(i), { x: (index + 1) * numSize, duration: 0.8, ease });
          }
        });

        gsap.to(getCardContent(active), {
          y: oTop + cHeight - 10,
          opacity: 0,
          duration: 0.3,
          ease
        });
        gsap.to(getSliderItem(active), { x: 0, duration: 0.8, ease });
        gsap.to(getSliderItem(oldActive), { x: numSize, duration: 0.8, ease });
      }
    });
  };

  const runAutoPlay = () => {
    if (indicatorTimeline.current) indicatorTimeline.current.kill();

    const tl = gsap.timeline({
      onComplete: async () => {
        await step("next");
        runAutoPlay();
      }
    });

    tl.set(".indicator", { x: -window.innerWidth });
    tl.to(".indicator", {
      x: 0,
      duration: 3.5,
      ease: "none"
    });
    tl.to(".indicator", {
      x: window.innerWidth,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.2
    });

    indicatorTimeline.current = tl;

    // If user is currently pressing/holding, pause the newly created timeline
    if (isPausedByUser.current) {
      tl.pause();
    }
  };

  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Avoid pausing if clicking arrow buttons or bookmark button
    const target = e.target as HTMLElement;
    if (target.closest(".arrow") || target.closest(".bookmark")) {
      return;
    }
    isPausedByUser.current = true;
    if (indicatorTimeline.current) {
      indicatorTimeline.current.pause();
    }
  };

  const handlePressEnd = () => {
    if (!isPausedByUser.current) return;
    isPausedByUser.current = false;
    if (indicatorTimeline.current && !isTransitioning.current) {
      indicatorTimeline.current.play();
    }
  };

  const handleArrowClick = async (direction: "next" | "prev") => {
    if (isTransitioning.current) return;
    if (indicatorTimeline.current) indicatorTimeline.current.kill();
    
    await step(direction);
    runAutoPlay();
  };

  useEffect(() => {
    init();

    const handleResize = () => {
      if (indicatorTimeline.current) indicatorTimeline.current.kill();
      init();
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (indicatorTimeline.current) indicatorTimeline.current.kill();
    };
  }, []);

  return (
    <div
      className="butterfly-gallery-root relative w-full h-full select-none overflow-hidden"
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
    >
      {/* Top running indicator */}
      <div className="indicator"></div>

      {/* Left-side soft shadow gradient for text readability */}
      <div className="shadow-left"></div>

      {/* Demo Container for Cards & Small Thumbnails */}
      <div id="demo">
        {DATA.map((item, index) => (
          <div
            key={index}
            className="card"
            id={`card${index}`}
            style={{ backgroundImage: `url(${item.image})` }}
          />
        ))}

        {DATA.map((item, index) => (
          <div
            key={index}
            className="card-content"
            id={`card-content-${index}`}
          >
            <div className="content-start"></div>
            <div className="content-place">{item.place}</div>
            <div className="content-title-1">{item.title}</div>
            <div className="content-title-2">{item.title2}</div>
          </div>
        ))}
      </div>

      {/* Details Box - Even */}
      <div className="details" id="details-even">
        <div className="place-box">
          <div className="text">{DATA[0].place}</div>
        </div>
        <div className="title-box-1">
          <div className="title-1">{DATA[0].title}</div>
        </div>
        <div className="title-box-2">
          <div className="title-2">{DATA[0].title2}</div>
        </div>
        <div className="desc">{DATA[0].description}</div>
        <div className="cta">
          <button className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Details Box - Odd */}
      <div className="details" id="details-odd">
        <div className="place-box">
          <div className="text">{DATA[0].place}</div>
        </div>
        <div className="title-box-1">
          <div className="title-1">{DATA[0].title}</div>
        </div>
        <div className="title-box-2">
          <div className="title-2">{DATA[0].title2}</div>
        </div>
        <div className="desc">{DATA[0].description}</div>
        <div className="cta">
          <button className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Pagination & Slider Control */}
      <div className="pagination" id="pagination">
        <button
          className="arrow arrow-left"
          onClick={() => handleArrowClick("prev")}
          aria-label="Previous Memory"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          className="arrow arrow-right"
          onClick={() => handleArrowClick("next")}
          aria-label="Next Memory"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <div className="progress-sub-container">
          <div className="progress-sub-background">
            <div className="progress-sub-foreground"></div>
          </div>
        </div>
        <div className="slide-numbers" id="slide-numbers">
          {DATA.map((_, index) => (
            <div key={index} className="item" id={`slide-item-${index}`}>
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Cover Screen Overlay */}
      <div className="cover"></div>
    </div>
  );
}
