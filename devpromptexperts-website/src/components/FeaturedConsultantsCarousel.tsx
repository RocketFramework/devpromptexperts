"use client";

import React, { useState, useEffect } from "react";
import ConsultantCard from "@/components/ConsultantCard";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";

interface FeaturedConsultantsCarouselProps {
  consultants: ConsultantDTO[];
  loading?: boolean;
}

export default function FeaturedConsultantsCarousel({
  consultants,
  loading = false
}: FeaturedConsultantsCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const visibleCount = 3;
  const total = consultants.length;

  useEffect(() => {
    if (loading || total <= visibleCount || isPaused) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(interval);
  }, [loading, total, isPaused, visibleCount]);

  const handlePrev = () => {
    if (total === 0) return;
    setCarouselIndex((prev) => (prev - 1 + total) % total);
  };
  const handleNext = () => {
    if (total === 0) return;
    setCarouselIndex((prev) => (prev + 1) % total);
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-slate-50 animate-pulse rounded-2xl border border-slate-100"></div>
        ))}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">No featured consultants found at the moment.</p>
      </div>
    );
  }

  const visibleConsultants = Array.from({ length: Math.min(visibleCount, total) }, (_, i) => {
    return consultants[(carouselIndex + i) % total];
  });

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid md:grid-cols-3 gap-8 transition-all duration-500">
        {visibleConsultants.map(consultant => (
          <ConsultantCard key={consultant.user_id} consultant={consultant} />
        ))}
      </div>

      {total > visibleCount && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
            aria-label="Previous"
          >
            &#8592;
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === carouselIndex ? 'w-6 bg-blue-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
}