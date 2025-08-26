import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/constants";

export const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate(ROUTES.LOGIN);
      } else if (!requireAuth && isAuthenticated) {
        navigate(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, loading, requireAuth, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    return <LoadingSpinner />;
  }

  if (!requireAuth && isAuthenticated) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AuthGuard;
