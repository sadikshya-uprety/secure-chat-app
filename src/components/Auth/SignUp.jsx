// src/components/Auth/SignUp.jsx
import React, { useState } from "react";
import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/chat");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container bg-gradient-to-r from-green-500 to-blue-500 h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-6">Sign Up</h1>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col items-center space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded-lg text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:bg-green-100 transition duration-300"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
};

export default SignUp;
