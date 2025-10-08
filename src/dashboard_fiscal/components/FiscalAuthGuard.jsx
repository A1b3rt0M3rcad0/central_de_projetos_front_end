import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFiscalAuth } from "../hooks/useFiscalAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const FiscalAuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useFiscalAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate("/fiscal/login");
      } else if (!requireAuth && isAuthenticated) {
        navigate("/fiscal/dashboard");
      }
    }
  }, [isAuthenticated, loading, navigate, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return children;
};

export default FiscalAuthGuard;

