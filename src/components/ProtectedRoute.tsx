// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Indlæser...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
