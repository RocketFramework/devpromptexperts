import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 40 }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fillPercent = Math.min(Math.max(rating - i, 0), 1) * 100;
    
    return (
      <div
        key={i}
        style={{
          position: "relative",
          width: size,
          height: size,
          display: "inline-block",
        }}
      >
        {/* Gray background star */}
        <FaStar
          size={size}
          color="#cfcfcfff"
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0 
          }}
        />
        
        {/* Yellow filled portion using SVG gradient */}
        <svg width={0} height={0}>
          <defs>
            <linearGradient id={`star-gradient-${i}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${fillPercent}%`} stopColor="#FFD700" />
              <stop offset={`${fillPercent}%`} stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        
        <FaStar
          size={size}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            fill: `url(#star-gradient-${i})`
          }}
        />
      </div>
    );
  });

  return (
    <div className="flex items-center justify-center border border-gray-400 rounded-md p-4 w-full">
      {stars}
    </div>
  );
}