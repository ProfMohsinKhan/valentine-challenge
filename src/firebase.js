import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCklkTa7Q47mRTTNnZWZeL_-D8nit_xhvI",
  authDomain: "valentine-challenge-a937a.firebaseapp.com",
  projectId: "valentine-challenge-a937a",
  storageBucket: "valentine-challenge-a937a.firebasestorage.app",
  messagingSenderId: "749221150678",
  appId: "1:749221150678:web:06bfee58b2451b80926e77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. EXPORT AUTH TOOLS
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { db, auth, googleProvider, signInWithPopup, signOut };