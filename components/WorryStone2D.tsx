"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type StoneType = "tomato" | "turtle" | "star";

type Props = {
  selectedStone: StoneType;
};

const stoneImages: Record<StoneType, string> = {
  tomato: "/stones/tomato-final.png",
  turtle: "/stones/turtle-final.png",
  star: "/stones/star-final.png",
};

export default function WorryStone2D({
  selectedStone,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPressing, setIsPressing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const [displayedStone, setDisplayedStone] =
    useState<StoneType>(selectedStone);

  const [motion, setMotion] = useState({
    rotateX: 0,
    rotateY: 0,
    moveX: 0,
    moveY: 0,
    scale: 1,
    glowX: 50,
    glowY: 45,
  });

  useEffect(() => {
    if (selectedStone === displayedStone) return;

    setIsVisible(false);

    const timer = setTimeout(() => {
      setDisplayedStone(selectedStone);
      setIsVisible(true);
    }, 180);

    return () => clearTimeout(timer);
  }, [selectedStone, displayedStone]);

  function updateMotion(clientX: number, clientY: number) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const px = Math.max(0, Math.min(1, x / rect.width));
    const py = Math.max(0, Math.min(1, y / rect.height));

    setMotion({
      rotateX: (0.5 - py) * 2.5,
      rotateY: (px - 0.5) * 2.5,
      moveX: (px - 0.5) * 2,
      moveY: (py - 0.5) * 2,
      scale: 0.992,
      glowX: px * 100,
      glowY: py * 100,
    });
  }

  function resetMotion() {
    setIsPressing(false);

    setMotion({
      rotateX: 0,
      rotateY: 0,
      moveX: 0,
      moveY: 0,
      scale: 1,
      glowX: 50,
      glowY: 45,
    });
  }

  return (
    <div className="flex h-full w-full translate-y-6 items-center justify-center px-6">
      <div
        ref={containerRef}
        className="relative w-full max-w-[380px] touch-none select-none"
        onPointerDown={(e) => {
          setIsPressing(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          updateMotion(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!isPressing) return;
          updateMotion(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }

          resetMotion();
        }}
        onPointerCancel={resetMotion}
      >
        <div
          className="relative aspect-square"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `
              perspective(1200px)
              translate3d(
                ${motion.moveX}px,
                ${motion.moveY}px,
                0
              )
              rotateX(${motion.rotateX}deg)
              rotateY(${motion.rotateY}deg)
              scale(${isVisible ? motion.scale : 0.97})
            `,
            transition: isPressing
              ? "transform 120ms ease-out, opacity 180ms ease"
              : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease",
          }}
        >
          <Image
            key={displayedStone}
            src={stoneImages[displayedStone]}
            alt={`${displayedStone} 워리스톤`}
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 90vw, 380px"
            draggable={false}
            className="pointer-events-none object-contain"
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  circle at ${motion.glowX}% ${motion.glowY}%,
                  rgba(255,255,255,0.18) 0%,
                  rgba(255,255,255,0.11) 18%,
                  rgba(255,255,255,0.05) 35%,
                  rgba(255,255,255,0) 60%
                )
              `,
              mixBlendMode: "screen",
              opacity: isPressing ? 0.8 : 0.22,
              transition: isPressing
                ? "opacity 150ms ease"
                : "opacity 500ms ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}