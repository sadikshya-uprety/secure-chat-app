import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Redirect to login if no user is authenticated
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
