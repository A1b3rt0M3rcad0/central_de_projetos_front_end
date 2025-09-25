import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner, { TopProgressBar } from "../ui/LoadingSpinner";
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <TopProgressBar active className="bg-transparent" />
        <LoadingSpinner subtle size="sm" text="" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <TopProgressBar active className="bg-transparent" />
        <LoadingSpinner subtle size="sm" text="" />
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <TopProgressBar active className="bg-transparent" />
        <LoadingSpinner subtle size="sm" text="" />
      </div>
    );
  }

  return children;
};

export default AuthGuard;
