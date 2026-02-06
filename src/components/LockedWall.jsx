import React, { useState, useEffect } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import GlobalLoveWall from "./GlobalLoveWall"; // Import your existing wall component
import { motion } from "framer-motion";

const LockedWall = ({ onBack }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="card"
      style={{ maxWidth: '400px', width: '90%' }}
    >
      {/* HEADER WITH BACK BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <button 
           onClick={onBack} 
           style={{ background: 'transparent', color: '#be185d', padding: '5px', fontSize: '1rem' }}
         >
           ← Back
         </button>
         {user && (
           <button 
             onClick={handleLogout}
             style={{ background: '#fecdd3', color: '#881337', fontSize: '0.8rem', padding: '5px 10px' }}
           >
             Logout
           </button>
         )}
      </div>

      {!user ? (
        // STATE 1: NOT LOGGED IN (The Gatekeeper)
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h2>🔒 VIP Area</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Want to see the <b>Global Wall of Love</b>? <br/>
            Sign in to peek at the top matches! 👀
          </p>
          
          <button 
            onClick={handleLogin}
            style={{ 
              background: 'white', 
              color: '#333', 
              border: '1px solid #ccc', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              margin: '0 auto',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              style={{ width: '20px' }} 
            />
            Sign in with Gmail
          </button>
        </div>
      ) : (
        // STATE 2: LOGGED IN (The Content)
        <div>
           <div style={{ textAlign: 'center', marginBottom: '15px' }}>
             <img 
               src={user.photoURL} 
               alt="User" 
               style={{ width: '40px', borderRadius: '50%', marginBottom: '5px' }} 
             />
             <p style={{ fontSize: '0.9rem', color: '#be185d' }}>
               Welcome, {user.displayName.split(' ')[0]}!
             </p>
           </div>
           
           {/* SHOW THE REAL WALL */}
           <GlobalLoveWall />
        </div>
      )}
    </motion.div>
  );
};

export default LockedWall;