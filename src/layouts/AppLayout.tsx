import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ROUTES } from "../constants/routes";

const AppLayout: React.FC = () => {
  const { token, userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!token || !userData) {
      navigate(ROUTES.auth.login, { replace: true });
    }
  }, [token, userData, navigate]);

  // Show loading state while checking authentication
  if (!token || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Render protected pages if authenticated
  return (
    <>
      <Outlet />
    </>
  );
};

export default AppLayout;
