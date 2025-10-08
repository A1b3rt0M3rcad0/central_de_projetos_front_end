import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fiscalApiService } from "../services/fiscalApi";

export const useFiscalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [fiscal, setFiscal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("fiscal_token");
      console.log("🔐 Token do fiscal:", token ? "Presente" : "Ausente");

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const storedFiscal = localStorage.getItem("fiscal_info");

      if (storedFiscal) {
        const fiscalParsed = JSON.parse(storedFiscal);
        if (fiscalParsed.token === token) {
          console.log("✅ Fiscal autenticado (cache):", fiscalParsed);
          setFiscal(fiscalParsed);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
      }

      // Buscar dados atualizados do fiscal
      console.log("🔍 Buscando dados do fiscal na API...");
      const response = await fiscalApiService.getMe();
      console.log("✅ Dados do fiscal recebidos:", response.data);

      const newFiscalInfo = {
        id: response.data.content.id,
        name: response.data.content.name,
        email: response.data.content.email,
        phone: response.data.content.phone,
        created_at: response.data.content.created_at,
        token: token,
      };

      localStorage.setItem("fiscal_info", JSON.stringify(newFiscalInfo));
      setFiscal(newFiscalInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Erro na autenticação do fiscal:", error);
      console.error("Detalhes:", error.response?.data);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("fiscal_token");
    localStorage.removeItem("fiscal_info");
    setIsAuthenticated(false);
    setFiscal(null);
    navigate("/fiscal/login");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    fiscal,
    loading,
    logout,
    checkAuth,
  };
};
