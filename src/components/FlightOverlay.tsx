"use client";

import { Calendar, MapPin } from "lucide-react";
import { RefObject } from "react";

interface Milestone {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

interface FlightOverlayProps {
  cardRefs: Record<number, RefObject<HTMLDivElement | null>>;
}

export default function FlightOverlay({ cardRefs }: FlightOverlayProps) {
  const milestones: Record<number, Milestone> = {
    1: {
      id: 1,
      title: "HAPPY 20TH BDAY KUTTI",
      date: "June 21, 2026",
      location: "A Special Milestone",
      description:
        "Happy 20th Birthday to the most amazing person! Born on June 21, 2006, may your day be as sweet as cake, and your year ahead be filled with endless smiles and beautiful skies. 💖",
      image: "/bday-1.png",
    },
    2: {
      id: 2,
      title: "Favorite Moments",
      date: "June 21, 2026",
      location: "Lost in Beauty",
      description:
        "Wishing you a year filled with bright flowers, endless laughter, and beautiful paths to walk. Keep shining bright, always! ✨",
      image: "/bday-2.jpg",
    },
    3: {
      id: 3,
      title: "Sweet Memories",
      date: "June 21, 2026",
      location: "A New Chapter",
      description:
        "Every moment with you is a sweet memory to cherish. May your 20s be a magical chapter of growth, love, and happiness. 🌸",
      image: "/bday-3.png",
    },
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {Object.values(milestones).map((milestone) => (
        <div
          key={milestone.id}
          ref={cardRefs[milestone.id]}
          style={{ display: "none" }} // Hidden by default, displayed & animated by WebGL loop
          className="absolute left-0 top-0 pointer-events-auto w-[88vw] max-w-[320px] sm:max-w-[350px] md:max-w-[380px] flex flex-col gap-4 text-white bg-transparent border-none shadow-none"
        >
          {/* Polaroid Photo Card content for Milestones 1, 2, 3 */}
          <div className="flex flex-col gap-4 w-full">
            {/* Polaroid Image Slot - Floating borderless look */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] bg-white/5 border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.3)]">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Metadata & Title - Floating clean look */}
            <div className="flex flex-col gap-2 px-1 text-white">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-200/90 uppercase tracking-[0.25em] font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                <Calendar className="h-3.5 w-3.5" />
                {milestone.date}
                {milestone.location && (
                  <>
                    <span className="text-rose-200/50">•</span>
                    <MapPin className="h-3 w-3" />
                    {milestone.location}
                  </>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {milestone.title}
              </h2>

              <div className="w-full h-[1px] bg-white/20 my-1 shadow-sm" />

              <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-sans font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                {milestone.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
