"use client";
import React, { useState } from "react";
import { featuredConsultants } from "@/data/consultants";
import ConsultantCard from "@/components/ConsultantCard";

export default function FeaturedConsultantsCarousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleCount = 3;
  const total = featuredConsultants.length;

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + total) % total);
  };
  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % total);
  };

  const visibleConsultants = Array.from({ length: visibleCount }, (_, i) => {
    return featuredConsultants[(carouselIndex + i) % total];
  });

  return (
    <div className="relative">
      <div className="grid md:grid-cols-3 gap-8 transition-all duration-500">
        {visibleConsultants.map(consultant => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={handlePrev}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
          aria-label="Previous"
        >
          &#8592;
        </button>
        {featuredConsultants.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCarouselIndex(idx)}
            className={`w-4 h-4 rounded-full mx-1 transition border-2 ${
              idx === carouselIndex ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
        <button
          onClick={handleNext}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition"
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}