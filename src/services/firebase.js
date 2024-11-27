import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCasMA7VSOsxAsB_gOF9ZWoBw72_yGGiQ4",
  authDomain: "chat-app-66d03.firebaseapp.com",
  projectId: "chat-app-66d03",
  storageBucket: "chat-app-66d03.firebasestorage.app",
  messagingSenderId: "1092364539262",
  appId: "1:1092364539262:web:362f29b744ec1101f2cf2f",
  measurementId: "G-QJ3PPC7T7W"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Exports
export { auth, googleProvider, db, storage };
