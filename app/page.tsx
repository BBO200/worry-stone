"use client";

import { useState } from "react";
import Image from "next/image";
import WorryStone2D from "@/components/WorryStone2D";
import StoneComments from "@/components/StoneComments";

type StoneType = "tomato" | "turtle" | "star" | "dalgona";

export default function Home() {
  const [selectedStone, setSelectedStone] =
    useState<StoneType>("tomato");

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#f3efe7]">
      <header className="flex justify-center pt-14 pb-2">
        <h1 className="text-sm tracking-[0.18em] text-neutral-600">
          오늘도 동글동글 괜찮아
        </h1>
      </header>

      <section className="flex-1 pt-6">
        <WorryStone2D selectedStone={selectedStone} />
      </section>

      <section className="px-6 pb-10">
        <p className="mb-7 text-center text-sm text-neutral-500">
          함께할 스톤을 골라보세요
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsCommentsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 bg-white/80 text-2xl text-neutral-500 shadow-sm transition duration-200 hover:scale-105 active:scale-95"
            aria-label="스톤 의견 열기"
          >
            +
          </button>

          <button
            onClick={() => setSelectedStone("tomato")}
            className={`transition-all duration-200 ${
              selectedStone === "tomato"
                ? "scale-110 opacity-100"
                : "scale-100 opacity-40"
            }`}
          >
            <div className="relative h-16 w-16">
              <Image
                src="/stones/tomato-final.png"
                alt="토마토 스톤"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </button>

          <button
            onClick={() => setSelectedStone("turtle")}
            className={`transition-all duration-200 ${
              selectedStone === "turtle"
                ? "scale-110 opacity-100"
                : "scale-100 opacity-40"
            }`}
          >
            <div className="relative h-16 w-16">
              <Image
                src="/stones/turtle-final.png"
                alt="거북이 스톤"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </button>

          <button
            onClick={() => setSelectedStone("star")}
            className={`transition-all duration-200 ${
              selectedStone === "star"
                ? "scale-110 opacity-100"
                : "scale-100 opacity-40"
            }`}
          >
            <div className="relative h-16 w-16">
              <Image
                src="/stones/star-final.png"
                alt="별 스톤"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </button>

          <button
            onClick={() => setSelectedStone("dalgona")}
            className={`transition-all duration-200 ${
              selectedStone === "dalgona"
                ? "scale-110 opacity-100"
                : "scale-100 opacity-40"
            }`}
          >
            <div className="relative h-16 w-16">
              <Image
                src="/stones/dalgona-final.png"
                alt="달고나 스톤"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </section>

      <StoneComments
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />
    </main>
  );
}