/**
 * Protected Route Component
 * Wraps routes that require authentication, redirecting unauthenticated users to the home page.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  /** The component or elements to render if authenticated. */
  children: React.ReactNode;
}

/**
 * A wrapper for routes that should only be accessible to logged-in users.
 * @param {ProtectedRouteProps} props Component properties.
 * @returns {React.JSX.Element} The children or a redirect.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): React.JSX.Element => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to home but save the intended location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
