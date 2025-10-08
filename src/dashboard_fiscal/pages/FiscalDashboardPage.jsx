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

      {/* Estatísticas Cards - Redesign com Gradientes */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          Visão Geral
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Card Projetos */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <FolderOpen className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {summary?.total_projetos_vinculados || 0}
            </p>
            <p className="text-xs opacity-90 font-medium">
              Projetos Vinculados
            </p>
          </div>

          {/* Card Fiscalizações */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {summary?.total_fiscalizacoes || 0}
            </p>
            <p className="text-xs opacity-90 font-medium">
              Fiscalizações Feitas
            </p>
          </div>

          {/* Card Documentos */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {summary?.documentos_enviados || 0}
            </p>
            <p className="text-xs opacity-90 font-medium">
              Documentos Enviados
            </p>
          </div>

          {/* Card Últimos 7 dias */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {summary?.fiscalizacoes_no_periodo || 0}
            </p>
            <p className="text-xs opacity-90 font-medium">Últimos 7 dias</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas - Redesign */}
      <div className="px-4 py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <HardHat className="w-6 h-6 text-orange-600" />
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Meus Projetos */}
          <button
            onClick={() => navigate("/fiscal/projects")}
            className="group bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-200 active:scale-95 transition-all duration-300"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
              Meus Projetos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summary?.total_projetos_vinculados || 0} vinculado
              {(summary?.total_projetos_vinculados || 0) !== 1 ? "s" : ""}
            </p>
          </button>

          {/* Minhas Fiscalizações */}
          <button
            onClick={() => navigate("/fiscal/work-projects")}
            className="group bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-green-200 active:scale-95 transition-all duration-300"
          >
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-sm text-gray-800 group-hover:text-green-600 transition-colors">
              Fiscalizações
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summary?.total_fiscalizacoes || 0} realizada
              {(summary?.total_fiscalizacoes || 0) !== 1 ? "s" : ""}
            </p>
          </button>
        </div>
      </div>

      {/* Últimas Fiscalizações - Redesign */}
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            Últimas Fiscalizações
          </h2>
          <button
            onClick={() => navigate("/fiscal/work-projects")}
            className="text-sm text-orange-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {latestWorkProjects.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 text-center shadow-lg border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Nenhuma fiscalização ainda
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
              Comece criando sua primeira fiscalização e contribua para o
              acompanhamento das obras
            </p>
            <button
              onClick={() => navigate("/fiscal/projects")}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
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
                className="group bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-200 active:scale-98 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-base group-hover:text-orange-600 transition-colors">
                      {workProject.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {workProject.description}
                    </p>
                    {workProject.project && workProject.project.name && (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-lg inline-flex border border-blue-200">
                        <FolderOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">
                          {workProject.project.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 flex-shrink-0 ml-3 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-4 text-xs mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    <span className="font-medium text-orange-700">
                      {formatDate(workProject.created_at)}
                    </span>
                  </div>
                  {(workProject.photo_name ? 1 : 0) +
                    (workProject.additional_documents?.length || 0) >
                    0 && (
                    <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg">
                      <Camera className="w-3.5 h-3.5 text-green-600" />
                      <span className="font-medium text-green-700">
                        {(workProject.photo_name ? 1 : 0) +
                          (workProject.additional_documents?.length || 0)}{" "}
                        {(workProject.photo_name ? 1 : 0) +
                          (workProject.additional_documents?.length || 0) ===
                        1
                          ? "foto"
                          : "fotos"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Flutuante para Nova Fiscalização - Enhanced */}
      <button
        onClick={() => navigate("/fiscal/projects")}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-110 z-40 animate-pulse-slow"
      >
        <Plus className="w-9 h-9" />
      </button>
    </div>
  );
}

export default FiscalDashboardPage;
