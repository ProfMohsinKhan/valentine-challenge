import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

// ---------------------------------------------------------
// 📸 GIF LINKS
// ---------------------------------------------------------
const GIFS = {
  perfect: "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyY2ZrdWJjNmtsa2hpZTQyMXUwbTYzNzFuNDFwa2VmMWdocmdqbGl5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s6fnVyWTfM2nUKuMVY/giphy.gif",
  high:    "https://media.tenor.com/WQjlw86rlpsAAAAM/muah-kiss.gif",
  good:    "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif",
  average: "https://media.tenor.com/sZqS55mgR3QAAAAj/jealous.gif",
  bad:     "https://media.tenor.com/f8YmpuCCXJcAAAAM/roasted-oh.gif",
};

// 👇 ADDED 'onViewWall' TO PROPS
const ResultCard = ({ name1, name2, score, onViewWall }) => {
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

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
    }
    if (score >= 60) {
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
      setTimeout(async () => {
         try {
            const canvas = await html2canvas(cardRef.current, {
              backgroundColor: "#fff5f7",
              scale: 2, 
              useCORS: true,
              allowTaint: true,
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `Love_Result_${name1}_${name2}.png`;
            link.click();
         } catch (err) {
            console.error("Screenshot failed:", err);
            alert("Could not save image.");
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
                crossOrigin="anonymous"
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

      {/* BUTTONS GROUP */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center', marginTop: '10px' }}>
        
        <button onClick={handleShare} className="share-btn" style={{width: '100%'}}>
          <a href="https://pbs.twimg.com/media/G3pBT_PXkAAyVDC.jpg">Share Result 📸</a>
        </button>

        {/* 👇 NEW BUTTON TO VIEW WALL */}
        <button 
          onClick={onViewWall}
          style={{ 
            background: 'transparent', 
            border: '2px solid #be185d', 
            color: '#be185d',
            width: '100%'
          }}
        >
          🌍 View Global Wall
        </button>

      </div>
    </div>
  );
};

export default ResultCard;