import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
  isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isLoggedIn }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ referrer: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;