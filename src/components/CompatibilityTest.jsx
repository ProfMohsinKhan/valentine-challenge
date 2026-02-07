import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const CompatibilityTest = ({ onCalculate }) => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const calculateScore = () => {
    if (!name1 || !name2) return;

    // --- 💘 SPECIAL MATCH LOGIC (EASTER EGG) 💘 ---
    const n1Clean = name1.toLowerCase().trim();
    const n2Clean = name2.toLowerCase().trim();

    // Check if the names match "mohsin khan" and "zeenat khan" in either order
    const isMohsinAndZeenat =
      (n1Clean === "mohsin khan" && n2Clean === "zeenat khan") ||
      (n1Clean === "zeenat khan" && n2Clean === "mohsin khan") ||
      (n1Clean === "mohsin khan" && n2Clean === "alyana khan") ||
      (n1Clean === "alyana khan" && n2Clean === "mohsin khan") ;

    if (isMohsinAndZeenat) {
      onCalculate(100, name1, name2);
      return; // 🛑 STOP here! Don't run the normal math.
    }
    // ----------------------------------------------

    // 1. Clean the names (remove ALL spaces for the algorithm)
    const n1 = name1.toLowerCase().replace(/\s/g, "");
    const n2 = name2.toLowerCase().replace(/\s/g, "");

    // 2. Calculate Matching Letters
    const set1 = new Set(n1.split(""));
    const set2 = new Set(n2.split(""));
    let matches = 0;

    // Check which unique chars from n1 are in n2
    set1.forEach((char) => {
      if (set2.has(char)) matches++;
    });

    // 3. Algorithm Logic (Deterministic)
    const totalLength = n1.length + n2.length;
    const baseScore = matches * 10 + totalLength * 2;

    // 4. ASCII Sum for extra randomness-feeling variation
    const combined = n1 + n2;
    const asciiSum = combined
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // 5. Final Calculation (Result always between 60% and 99%)
    // The modulo (%) 40 ensures a range of 0-39. Adding 60 makes it 60-99.
    const finalPercentage = ((baseScore + asciiSum) % 40) + 60;

    // Send data back to App.js
    onCalculate(finalPercentage, name1, name2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 style={{ color: "#db2777", marginBottom: "20px" }}>
        Love Calculator 💘
      </h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Your Full Name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
        />
        <Heart
          className="heart-icon"
          size={24}
          fill="#fb7185"
          color="#fb7185"
        />
        <input
          type="text"
          placeholder="Crush Full Name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
        />
      </div>

      <button
        onClick={calculateScore}
        disabled={!name1 || !name2}
        className="calc-btn"
      >
        Calculate Love %
      </button>
    </motion.div>
  );
};

export default CompatibilityTest;