import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

// ---------------------------------------------------------
// 📸 PASTE YOUR GIF LINKS HERE
// ---------------------------------------------------------
const GIFS = {
  perfect: "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyY2ZrdWJjNmtsa2hpZTQyMXUwbTYzNzFuNDFwa2VmMWdocmdqbGl5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s6fnVyWTfM2nUKuMVY/giphy.gif", // Score 100 (Soulmates)
  high:    "https://media.tenor.com/WQjlw86rlpsAAAAM/muah-kiss.gif", // Score 85-99 (Love is in the air)
  good:    "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif", // Score 70-84 (Solid couple)
  average: "https://media.tenor.com/sZqS55mgR3QAAAAj/jealous.gif", // Score < 70 (Funny/Awkward)
  bad: "https://media.tenor.com/f8YmpuCCXJcAAAAM/roasted-oh.gif", // Score < 70 (Funny/Awkward)
  
};
// ---------------------------------------------------------

const ResultCard = ({ name1, name2, score }) => {
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

  // Determine the Data (Text, Color, GIF) based on score
  const getResultData = () => {
    if (score == 100) {
      return { 
        text: "Kismat ne milaya hai! 💍 , agar andha hota , toh duniya ki sabse haseen cheez dekh nahi pata ... aap", 
        color: "#16a34a", 
        gif: GIFS.perfect 
      };
    }
    if (score >= 85) {
      return { 
        text: "Perfect Match! 💖 , phool hu gulaab ka chameli ka mat samajhna ... aashiq hai aapke apne dost ka na smajhna", 
        color: "#37e11d", 
        gif: GIFS.high 
      };
    }
    if (score >= 70) {
      return { 
        text: "good Connection! 🥰 Aisa laga khuda ne rakh diya hamare dil pe haath... liya naam hamare unhone kuch aisi ada ke saath", 
        color: "#64873a", 
        gif: GIFS.good 
      };
    }if (score >= 60) {
      return { 
        text: "ok Connection! 🥰 , kehte hai pyaar mei neend udd jaati hai... koi humse bhi mohabbat kare ... kambhatk neend bohut aati hai", 
        color: "#db2777", 
        gif: GIFS.average 
      };
    }
    return { 
      text: "Keep Trying... 😬, beta tumse na ho payega", 
      color: "#ea580c", 
      gif: GIFS.bad 
    };
  };

  const { text, color, gif } = getResultData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      // Only fire confetti for good scores
      if (score >= 70) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [score]);

  const handleShare = async () => {
    if (cardRef.current) {
      // Small delay to ensure images are rendered
      setTimeout(async () => {
         try {
            const canvas = await html2canvas(cardRef.current, {
              backgroundColor: "#fff5f7",
              scale: 2, 
              useCORS: true, // IMPORTANT: Allows saving images from the web
              allowTaint: true,
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `Love_Result_${name1}_${name2}.png`;
            link.click();
         } catch (err) {
            console.error("Screenshot failed:", err);
            alert("Could not save image (browser security blocked the GIF). Try taking a screenshot manually!");
         }
      }, 500)
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="animate-pulse" style={{color: '#db2777'}}>Analyzing your love... 💕</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card result-card"
        style={{ position: 'relative', overflow: 'hidden' }} 
      >
        <h3>Compatibility Report 💌</h3>

        {/* --- DYNAMIC GIF SECTION --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <img 
                src={gif} 
                alt="Reaction Gif"
                crossOrigin="anonymous" // Helps with screenshotting
                style={{ 
                    maxWidth: '100%',
                    height: '140px', 
                    borderRadius: '15px',
                    objectFit: 'cover',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }} 
            />
        </motion.div>

        <div className="names">
          <span>{name1}</span>
          <span className="plus">+</span>
          <span>{name2}</span>
        </div>

        <div className="score-circle" style={{ borderColor: color }}>
          <span className="score-text" style={{ color: color }}>
            {score}%
          </span>
        </div>

        <p className="result-message">{text}</p>
        <p className="footer-text">Official Valentine Verification ✅</p>
      </motion.div>

      <button onClick={handleShare} className="share-btn">
        Share Result 📸
      </button>
    </div>
  );
};

export default ResultCard;  