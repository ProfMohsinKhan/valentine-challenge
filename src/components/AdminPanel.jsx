import React, { useState, useEffect } from "react";
import { db, auth, signInWithPopup, googleProvider, signOut } from "../firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

// 🔒 REPLACE THIS WITH YOUR EXACT GMAIL ADDRESS
const ADMIN_EMAIL = "mohsin.mohsin6@gmail.com"; 

const AdminPanel = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name1: "", name2: "", score: 0 });

  // 1. Check Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data Real-time
  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      const q = query(collection(db, "matches"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMatches(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // --- ACTIONS ---

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      await deleteDoc(doc(db, "matches", id));
    }
  };

  const startEdit = (match) => {
    setEditingId(match.id);
    setEditForm({ name1: match.name1, name2: match.name2, score: match.score });
  };

  const saveEdit = async (id) => {
    await updateDoc(doc(db, "matches", id), {
      name1: editForm.name1,
      name2: editForm.name2,
      score: Number(editForm.score),
    });
    setEditingId(null);
  };

  // Filter matches based on search
  const filteredMatches = matches.filter((m) => 
    m.name1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER: LOGIN GATE ---
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="card">
        <h2>🛡️ Admin Only</h2>
        <p>You must be the owner to access this.</p>
        {user ? (
          <div>
            <p style={{color: 'red'}}>Logged in as: {user.email} (Not Admin)</p>
            <button onClick={() => signOut(auth)}>Logout</button>
            <button onClick={onBack} style={{marginTop: '10px', background: 'transparent', color: '#be185d', border: '1px solid #be185d'}}>Back Home</button>
          </div>
        ) : (
            <>
            <button onClick={handleLogin}>Login as Admin</button>
            <button onClick={onBack} style={{marginTop: '10px', background: 'transparent', color: '#be185d', border: '1px solid #be185d'}}>Back Home</button>
            </>
        )}
      </div>
    );
  }

  // --- RENDER: DASHBOARD ---
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="card" 
      style={{ maxWidth: '600px' }} // Wider card for admin
    >
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
        <h3>⚡ Admin Dashboard</h3>
        <button onClick={onBack} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Exit</button>
      </div>

      {/* SEARCH BAR */}
      <input 
        type="text" 
        placeholder="🔍 Search names..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', background: '#fff' }}
      />

      {/* DATA LIST */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', textAlign: 'left' }}>
        {filteredMatches.map((match) => (
          <div key={match.id} style={{ 
            background: 'rgba(255,255,255,0.6)', 
            marginBottom: '10px', 
            padding: '10px', 
            borderRadius: '10px',
            border: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            {editingId === match.id ? (
              // --- EDIT MODE ---
              <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                <input value={editForm.name1} onChange={(e) => setEditForm({...editForm, name1: e.target.value})} placeholder="Name 1" style={{width: '30%'}} />
                <input value={editForm.name2} onChange={(e) => setEditForm({...editForm, name2: e.target.value})} placeholder="Name 2" style={{width: '30%'}} />
                <input value={editForm.score} onChange={(e) => setEditForm({...editForm, score: e.target.value})} placeholder="%" type="number" style={{width: '15%'}} />
                <button onClick={() => saveEdit(match.id)} style={{background: '#16a34a', width: 'auto', padding: '5px'}}>💾</button>
                <button onClick={() => setEditingId(null)} style={{background: '#666', width: 'auto', padding: '5px'}}>❌</button>
              </div>
            ) : (
              // --- VIEW MODE ---
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <strong>{match.name1}</strong> + <strong>{match.name2}</strong>
                  <div style={{fontSize: '0.8rem', color: '#666'}}>
                     Score: <span style={{fontWeight:'bold', color: match.score > 80 ? 'green' : 'orange'}}>{match.score}%</span>
                     <span style={{marginLeft: '10px', fontSize: '0.7rem'}}>
                       {match.createdAt?.toDate().toLocaleDateString()}
                     </span>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '5px'}}>
                    <button onClick={() => startEdit(match)} style={{background: '#3b82f6', width: '30px', height: '30px', padding: 0, display:'flex', alignItems:'center', justifyContent:'center'}}>✏️</button>
                    <button onClick={() => handleDelete(match.id)} style={{background: '#ef4444', width: '30px', height: '30px', padding: 0, display:'flex', alignItems:'center', justifyContent:'center'}}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredMatches.length === 0 && <p style={{textAlign: 'center'}}>No matches found.</p>}
      </div>
    </motion.div>
  );
};

export default AdminPanel;