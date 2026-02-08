import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import GlobalLoveWall from "./components/GlobalLoveWall"; 
import LockedWall from "./components/LockedWall"; 
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import RomanticBackground from "./components/UI/RomanticBackground";
import CompatibilityTest from "./components/CompatibilityTest";
import ResultCard from "./components/ResultCard"; 
import confetti from "canvas-confetti"; 
import AdminPanel from "./components/AdminPanel"; // Import the new component

function App() {
  
  const [stage, setStage] = useState("intro"); // intro, question, popup, calculator, result, wall
  const [noCount, setNoCount] = useState(0);
  const [results, setResults] = useState({ name1: "", name2: "", score: 0 });

  const noMessages = [
    "No 🙄",
    "Are you sure? I practiced a lot to ask this 😔",
    "My heart is cracking 💔",
    "Please don’t do this to me 🥺",
    "You're making me cry... 😭",
  ];

  const handleNoClick = () => {
    if (noCount < 4) {
      setNoCount(noCount + 1);
    } else {
      setStage("popup");
    }
  };

  const handleCalculation = async (score, n1, n2) => {
    setResults({ score, name1: n1, name2: n2 });
    setStage("result");
    
    // 🔥 SAVE TO FIREBASE (Secretly)
    try {
      await addDoc(collection(db, "matches"), {
        name1: n1,
        name2: n2,
        score: score,
        createdAt: serverTimestamp(),
      });
      console.log("Secretly saved to Firebase! 🤫");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="app-container">
      <RomanticBackground count={noCount} />

      <AnimatePresence mode="wait">
        {/* STAGE 1: INTRO */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card"
          >
            <h1>Hey... I have something special to ask you 🥺</h1>
            <button onClick={() => setStage("question")}>Continue 💌</button>
            {/* 🗑️ REMOVED GLOBAL WALL BUTTON FROM HERE */}
            {/* 👇 1. ADD THIS SECRET ADMIN LINK 👇 */}
            <div style={{ marginTop: '20px', opacity: 0.3 }}>
              <span 
                onClick={() => setStage("admin")}
                style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#be185d' }}
              >
                Admin Login 🔒
              </span>
            </div>
            
          </motion.div>
        )}


        {/* STAGE 2: QUESTION */}
        {stage === "question" && (
          <motion.div
            key="question"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card"
          >
            <h1 className="question-text">Will you be my Valentine? 💖</h1>

            <div className="button-group">
              <button
                className="yes-button"
                style={{
                  fontSize: `${1.1 + noCount * 0.5}rem`,
                  padding: `${12 + noCount * 5}px ${24 + noCount * 10}px`,
                }}
                onClick={() => {
                  setStage("success"); 
                  confetti(); 
                }}
              >
                YES 😍
              </button>

              {noCount < 5 && (
                <button
                  className="no-button"
                  onClick={handleNoClick}
                >
                  {noMessages[noCount]}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* STAGE 3: POPUP */}
        {stage === "popup" && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="card popup-card"
            >
              <h2 className="text-emotional">
                I think your heart already said YES ❤️
              </h2>
              <p className="text-sub">
                But… if you think you might be more compatible with someone
                else, check your compatibility test 👀
              </p>

              <button
                className="compat-btn"
                onClick={() => setStage("calculator")}
              >
                👉 Check Compatibility 💖
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* STAGE: SUCCESS */}
        {stage === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card"
          >
            <h1 style={{ fontSize: "3rem" }}>YAY! 🎉</h1>
            <p style={{ fontSize: "1.2rem", color: "#db2777", margin: "20px 0" }}>
              You just made my day! 💖
            </p>
            <p style={{ color: "#555" }}>
              Now, let's see how compatible we actually are... 👀
            </p>

            <button
              onClick={() => setStage("calculator")}
              style={{ marginTop: "20px" }}
            >
              Check Our Compatibility 👉
            </button>
          </motion.div>
        )}

        {/* STAGE 4: CALCULATOR */}
        {stage === "calculator" && (
          <CompatibilityTest key="calculator" onCalculate={handleCalculation} />
        )}

        {/* STAGE 5: RESULT */}
        {stage === "result" && (
          <ResultCard
            key="result"
            name1={results.name1}
            name2={results.name2}
            score={results.score}
            // 👇 PASSING THE FUNCTION TO SWITCH TO WALL
            onViewWall={() => setStage("wall")} 
          />
        )}

        {/* NEW STAGE: LOCKED WALL */}
        {stage === "wall" && (
          <LockedWall key="wall" onBack={() => setStage("intro")} />
        )}

          {/* 👇 2. ADD THIS NEW ADMIN STAGE 👇 */}
        {stage === "admin" && (
           <AdminPanel key="admin" onBack={() => setStage("intro")} />
        )}
        
      </AnimatePresence>
    </div>
  );
}

export default App;