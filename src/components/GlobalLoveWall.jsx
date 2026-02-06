import React, { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const GlobalLoveWall = () => {
  const [matches, setMatches] = useState([]);
  const [totalCalculations, setTotalCalculations] = useState(0);
  
  // NEW: State to track which filter is active ('score' or 'createdAt')
  const [sortBy, setSortBy] = useState("score"); 

  useEffect(() => {
    // 1. Dynamic Query based on 'sortBy' state
    const q = query(
      collection(db, "matches"),
      orderBy(sortBy, "desc"), // This switches between 'score' and 'createdAt'
      limit(20)
    );

    // 2. Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMatches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(fetchedMatches);
      
      // Fake total count logic
      setTotalCalculations(fetchedMatches.length + 1400); 
    });

    return () => unsubscribe();
  }, [sortBy]); // <--- IMPORTANT: Re-run this effect when 'sortBy' changes

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="wall-container"
    >
      <div className="wall-header">
        <h3>🌍 Global Wall of Love</h3>
        
        {/* --- NEW: Filter Buttons --- */}
        <div className="filter-buttons">
          <button 
            className={sortBy === "score" ? "active" : ""} 
            onClick={() => setSortBy("score")}
          >
            🔥 Top Scores
          </button>
          <button 
            className={sortBy === "createdAt" ? "active" : ""} 
            onClick={() => setSortBy("createdAt")}
          >
            🕒 Most Recent
          </button>
        </div>

        <p style={{ marginTop: "10px", fontSize: "0.9rem", opacity: 0.8 }}>
          {totalCalculations} couples tested so far!
        </p>
      </div>

      <div className="scrolling-list">
        {matches.map((match) => (
          <div key={match.id} className="match-item">
            <span className="match-names">
              {match.name1.length > 8 ? match.name1.substring(0,6)+"..." : match.name1} 
              {" + "} 
              {match.name2.length > 8 ? match.name2.substring(0,6)+"..." : match.name2}
            </span>
            <span 
              className="match-score"
              style={{ 
                color: match.score >= 90 ? "#16a34a" : 
                       match.score >= 70 ? "#db2777" : "#ea580c" 
              }}
            >
              {match.score}% {match.score >= 90 ? "🔥" : "💖"}
            </span>
          </div>
        ))}
        
        {matches.length === 0 && (
          <p className="empty-msg">Loading Love Data... ⏳</p>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalLoveWall;