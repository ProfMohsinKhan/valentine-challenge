import React from "react";
import { motion } from "framer-motion";

const CupidAnimation = () => {
  return (
    <div style={{ position: "relative", width: "300px", height: "150px", margin: "0 auto" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- 1. THE BOW (Stays on left) --- */}
        <motion.path
          d="M 40 20 Q 10 75 40 130" // Curved bow shape
          stroke="#8B4513"
          strokeWidth="4"
          fill="transparent"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* Bow String */}
        <motion.line
          x1="40" y1="20" x2="40" y2="130"
          stroke="#ccc"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />

        {/* --- 2. THE ARROW (Flies across) --- */}
        <motion.g
          initial={{ x: 0, opacity: 0 }}
          animate={{ 
            x: [0, -20, 200], // Pull back, then shoot forward
            opacity: [0, 1, 1, 0] // Fade in, fly, then disappear inside heart
          }} 
          transition={{ 
            duration: 1.5, 
            times: [0, 0.2, 1], // Timing of the pull back vs shoot
            delay: 0.8 // Wait for bow to appear
          }}
        >
          {/* Arrow Shaft */}
          <line x1="10" y1="75" x2="80" y2="75" stroke="#555" strokeWidth="4" />
          {/* Arrow Feather */}
          <path d="M 10 75 L 0 65 M 10 75 L 0 85" stroke="#555" strokeWidth="3" />
          {/* Arrow Tip */}
          <path d="M 80 75 L 70 70 L 70 80 Z" fill="#555" />
        </motion.g>

        {/* --- 3. THE HEART (Target) --- */}
        <motion.path
          d="M 220 60 C 220 40, 200 40, 200 60 C 200 40, 180 40, 180 60 C 180 90, 220 120, 220 120 C 220 120, 260 90, 260 60 C 260 40, 240 40, 240 60"
          fill="#e11d48"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1, 1.2, 1], // Pop in, then throb when hit
          }}
          transition={{ 
            duration: 0.5,
            delay: 1.8 // Wait for arrow to hit
          }}
        />
        
        {/* --- 4. TEXT "MATCHED" --- */}
        <motion.text
           x="220" y="30"
           textAnchor="middle"
           fill="#e11d48"
           fontSize="14"
           fontWeight="bold"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 2.2 }}
        >
          💘 HIT!
        </motion.text>
      </svg>
    </div>
  );
};

export default CupidAnimation;