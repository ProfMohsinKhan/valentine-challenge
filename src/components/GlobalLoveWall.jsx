import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const GlobalLoveWall = () => {
  const [matches, setMatches] = useState([]);
  // 'recent' = Sort by Time, 'top' = Sort by Score
  const [filter, setFilter] = useState("recent"); 
  const [totalCalculations, setTotalCalculations] = useState(0);

  useEffect(() => {
    // Dynamically choose the sorting field based on the filter state
    const sortField = filter === "recent" ? "createdAt" : "score";

    const q = query(
      collection(db, "matches"),
      orderBy(sortField, "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMatches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(fetchedMatches);
      
      // Update total count
      setTotalCalculations(fetchedMatches.length + 1400); 
    });

    return () => unsubscribe();
  }, [filter]); // Re-run this effect whenever 'filter' changes

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="wall-container"
    >
      <div className="wall-header">
        <h3>🌍 Global Wall of Love</h3>
        
        {/* --- FILTER BUTTONS --- */}
        <div className="filter-buttons">
          <button 
            className={filter === "recent" ? "active-filter" : ""} 
            onClick={() => setFilter("recent")}
          >
            Newest
          </button>
          <button 
            className={filter === "top" ? "active-filter" : ""} 
            onClick={() => setFilter("top")}
          >
            Top Scores
          </button>
        </div>

        <p className="counter-text">{totalCalculations} couples tested!</p>
      </div>

      <div className="scrolling-list">
        <AnimatePresence mode="popLayout">
          {matches.map((match) => {
            const isPerfect = Number(match.score) === 100;

            return (
              <motion.div 
                key={match.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  // Pulse animation ONLY if score is 100
                  scale: isPerfect ? [1, 1.02, 1] : 1,
                  boxShadow: isPerfect ? "0px 0px 8px rgba(255, 215, 0, 0.6)" : "none"
                }}
                transition={{ 
                  duration: 0.3,
                  // Infinite pulse for 100% scorers
                  scale: { repeat: isPerfect ? Infinity : 0, duration: 1.5 } 
                }}
                className={`match-item ${isPerfect ? "perfect-match" : ""}`}
              >
                <span className="match-names">
                  {match.name1.length > 8 ? match.name1.substring(0,6)+"..." : match.name1} 
                  {" + "} 
                  {match.name2.length > 8 ? match.name2.substring(0,6)+"..." : match.name2}
                </span>
                
                <span 
                  className="match-score"
                  style={{ 
                    color: isPerfect ? "#d97706" : // Gold color for 100
                           match.score >= 90 ? "#16a34a" : 
                           match.score >= 70 ? "#db2777" : "#ea580c" 
                  }}
                >
                  {match.score}% {isPerfect ? "🏆" : match.score >= 90 ? "🔥" : "💖"}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {matches.length === 0 && (
          <p className="empty-msg">Loading data... ⏳</p>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalLoveWall;