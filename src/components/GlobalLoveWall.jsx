import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust path if needed
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const GlobalLoveWall = () => {
  const [matches, setMatches] = useState([]);
  const [totalCalculations, setTotalCalculations] = useState(0);

  useEffect(() => {
    // 1. Create a query to get the last 20 matches
    const q = query(
      collection(db, "matches"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    // 2. Listen for real-time updates (onSnapshot)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMatches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(fetchedMatches);
      
      // OPTIONAL: Fake a "Total Count" based on list size + generic number
      // (For a real total count, you'd need a separate counter in Firebase)
      setTotalCalculations(fetchedMatches.length + 1400); 
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="wall-container"
    >
      <div className="wall-header">
        <h3>🌍 Global Wall of Love</h3>
        <p>{totalCalculations} couples tested so far!</p>
      </div>

      <div className="scrolling-list">
        {matches.map((match) => (
          <div key={match.id} className="match-item">
            <span className="match-names">
              {/* Truncate names if they are too long */}
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
          <p className="empty-msg">Be the first to test your love! 👇</p>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalLoveWall;