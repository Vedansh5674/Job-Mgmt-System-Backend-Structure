import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

/**
 * ProtectedRoute Component
 * @param {Element} children - The component to render if authorized
 * @param {string} role - Optional role requirement (e.g., 'recruiter')
 */
const ProtectedRoute = ({ children, role }) => {
  const { user } = useStore();
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // If user doesn't have the required role, redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
