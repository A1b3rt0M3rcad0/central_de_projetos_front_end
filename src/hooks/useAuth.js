import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_CONFIG } from "../config/constants";
import userAPI from "../services/api/user";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem(AUTH_CONFIG.USER_INFO_KEY);

      if (storedUser) {
        const userParsed = JSON.parse(storedUser);
        if (userParsed.token === token) {
          setUser(userParsed);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
      }

      // Buscar dados atualizados do usuário
      const response = await userAPI.getWhoAmI(token);
      const updatedToken = response.data?.access_token || token;

      if (response.data?.access_token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, updatedToken);
      }

      const newUserInfo = {
        name: response.data.content.name,
        role: response.data.content.role,
        cpf: response.data.content.cpf,
        token: updatedToken,
      };

      localStorage.setItem(
        AUTH_CONFIG.USER_INFO_KEY,
        JSON.stringify(newUserInfo)
      );
      setUser(newUserInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro na autenticação:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    checkAuth,
  };
};
