import React, { useMemo } from "react";
import "./RomanticBackground.css";

const RomanticBackground = ({ count }) => {
  // Determine intensity based on "No" clicks
  const isWindy = count >= 3;
  const isStormy = count >= 4;

  // As count increases, we add more petals
  const petalCount = 20 + count * 10;

  // Generate stable random petals
  const petals = useMemo(() => {
    return Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "vw", // Random horizontal position
      delay: Math.random() * 5 + "s", // Random start time
      duration: Math.random() * 5 + 5 + "s", // Random speed
      size: Math.random() * 20 + 10 + "px", // Random size
      emoji: Math.random() > 0.7 ? "🌹" : "🌸", // Mix of flowers
    }));
  }, [petalCount]);

  return (
    <div
      className={`bg-container ${isWindy ? "windy" : ""} ${isStormy ? "stormy" : ""}`}
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            fontSize: petal.size,
            // If windy, speed up animation drastically
            animationDuration: isWindy ? "2s" : petal.duration,
          }}
        >
          {petal.emoji}
        </span>
      ))}

      {/* Dark overlay for the "sad" effect on higher counts */}
      <div className="overlay" style={{ opacity: count * 0.1 }}></div>
    </div>
  );
};

export default RomanticBackground;
