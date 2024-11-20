// src/components/Auth/GoogleAuth.jsx
import React from "react";
import { signInWithGoogle } from "../../services/firebase";

const GoogleAuth = ({ onSuccess }) => {
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user && onSuccess) onSuccess(user);
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
    >
      Login with Google
    </button>
  );
};

export default GoogleAuth;
