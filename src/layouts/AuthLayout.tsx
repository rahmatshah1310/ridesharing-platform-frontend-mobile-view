import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ROUTES } from "../constants/routes";

const AuthLayout: React.FC = () => {
  const { token, userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to profile
    if (token && userData) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [token, userData, navigate]);

  // Show loading state while checking authentication
  if (token && userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render auth pages if not authenticated
  return <Outlet />;
};

export default AuthLayout;
