import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HardHat,
  Camera,
  FileText,
  FolderOpen,
  TrendingUp,
  LogOut,
  Menu,
  X,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useFiscalAuth } from "../hooks/useFiscalAuth";
import { fiscalApiService } from "../services/fiscalApi";
import logo from "../../assets/logo_gov.png";

function FiscalDashboardPage() {
  const navigate = useNavigate();
  const { fiscal, logout } = useFiscalAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [latestWorkProjects, setLatestWorkProjects] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar resumo do fiscal com últimos 7 dias
      console.log("🔍 Buscando resumo do fiscal...");
      const endDate = new Date().toISOString();
      const startDate = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      const summaryResponse = await fiscalApiService.getSummary(
        startDate,
        endDate,
        5
      );
      console.log("✅ Resumo recebido:", summaryResponse.data);
      setSummary(summaryResponse.data.content);

      // Buscar últimas fiscalizações
      console.log("🔍 Buscando últimas fiscalizações...");
      const latestResponse = await fiscalApiService.getLatestWorkProjects(5, 1);
      console.log("✅ Fiscalizações recebidas:", latestResponse.data);
      // O content JÁ é o array de work_projects
      setLatestWorkProjects(latestResponse.data.content || []);
    } catch (error) {
      console.error("❌ Erro ao carregar dados do dashboard:", error);
      console.error("Detalhes do erro:", error.response?.data);
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

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Mobile */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="font-bold text-lg">Portal do Fiscal</h1>
                <p className="text-xs text-orange-100">Olá, {fiscal?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Dropdown */}
        {menuOpen && (
          <div className="bg-white text-gray-800 shadow-lg border-t border-gray-200">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/fiscal/profile");
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <User className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Meu Perfil</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas Cards */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Estatísticas
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary?.total_projetos_vinculados || 0}
            </p>
            <p className="text-xs text-gray-600 font-medium">Projetos</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary?.total_fiscalizacoes || 0}
            </p>
            <p className="text-xs text-gray-600 font-medium">Fiscalizações</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary?.documentos_enviados || 0}
            </p>
            <p className="text-xs text-gray-600 font-medium">Documentos</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {summary?.fiscalizacoes_no_periodo || 0}
            </p>
            <p className="text-xs text-gray-600 font-medium">Últimos 7 dias</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="px-4 py-6 bg-white border-t border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/fiscal/projects")}
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <FolderOpen className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold text-sm">Meus Projetos</p>
          </button>

          <button
            onClick={() => navigate("/fiscal/work-projects")}
            className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <FileText className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold text-sm">Minhas Fiscalizações</p>
          </button>
        </div>
      </div>

      {/* Últimas Fiscalizações */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Últimas Fiscalizações
          </h2>
          <button
            onClick={() => navigate("/fiscal/work-projects")}
            className="text-sm text-orange-600 font-medium flex items-center gap-1"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {latestWorkProjects.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">
              Nenhuma fiscalização ainda
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Comece criando sua primeira fiscalização
            </p>
            <button
              onClick={() => navigate("/fiscal/projects")}
              className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Fiscalização
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {latestWorkProjects.map((workProject) => (
              <div
                key={workProject.id}
                onClick={() =>
                  navigate(`/fiscal/work-project/${workProject.id}`)
                }
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 active:scale-98 transition-transform cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                      {workProject.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                      {workProject.description}
                    </p>
                    {workProject.project && workProject.project.name && (
                      <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg inline-flex">
                        <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                          {workProject.project.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    <span>{formatDate(workProject.created_at)}</span>
                  </div>
                  {(workProject.photo_name ? 1 : 0) +
                    (workProject.additional_documents?.length || 0) >
                    0 && (
                    <div className="flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-green-600" />
                      <span>
                        {(workProject.photo_name ? 1 : 0) +
                          (workProject.additional_documents?.length || 0)}{" "}
                        fotos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Flutuante para Nova Fiscalização */}
      <button
        onClick={() => navigate("/fiscal/projects")}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform hover:shadow-xl z-40"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}

export default FiscalDashboardPage;
