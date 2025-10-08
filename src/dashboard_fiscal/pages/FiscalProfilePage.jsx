import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Shield,
} from "lucide-react";
import { useFiscalAuth } from "../hooks/useFiscalAuth";
import { fiscalApiService } from "../services/fiscalApi";

function FiscalProfilePage() {
  const navigate = useNavigate();
  const { fiscal, logout } = useFiscalAuth();
  const [fiscalData, setFiscalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiscalData();
  }, []);

  const loadFiscalData = async () => {
    try {
      setLoading(true);
      const response = await fiscalApiService.getMe();
      setFiscalData(response.data.content);
    } catch (error) {
      console.error("Erro ao carregar dados do fiscal:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/fiscal/dashboard")}
              className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-bold text-lg">Meu Perfil</h1>
              <p className="text-xs text-orange-100">Informações pessoais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-4 py-6 space-y-6">
        {/* Avatar e Nome */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {fiscalData?.name || fiscal?.name}
          </h2>
          <p className="text-sm text-gray-600">Fiscal de Obras</p>
        </div>

        {/* Informações de Contato */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Informações de Contato
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800 break-all">
                  {fiscalData?.email || fiscal?.email}
                </p>
              </div>
            </div>

            {fiscalData?.phone && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Telefone</p>
                  <p className="text-sm font-medium text-gray-800">
                    {fiscalData.phone}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Cadastrado em</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(fiscalData?.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Ações</h3>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-100 p-4 rounded-lg transition-colors font-semibold border-2 border-red-200"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
        </div>

        {/* Informações do App */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-2 text-sm">
            Sobre o Aplicativo
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Portal do Fiscal - Versão 1.0.0</p>
            <p>Prefeitura Municipal de Imbituba</p>
            <p className="text-gray-500">© 2025 - Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiscalProfilePage;

