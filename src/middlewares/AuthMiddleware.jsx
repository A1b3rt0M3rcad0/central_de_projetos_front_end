import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthMiddleware({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login"); // Redireciona para rota login
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return null; // ou um loader
  }

  return children;
}

export default AuthMiddleware;
