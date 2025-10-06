import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import ProjectListContent from "../../features/contents/ProjectListContent";
import projectApi from "../../services/api/project";
import { useEffect } from "react";
import Swal from "sweetalert2";
import LoadingContent from "../../features/contents/LoadingContent";
import { UI_CONFIG } from "../../config/constants";

export default function ProjectListPage() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);

  // Obter página atual da URL ou usar 1 como padrão
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10; // Valor constante para simplificar

  const fetchProjects = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      // Usando a rota de paginação com filtro
      const response = await projectApi.getProjectsWithPaginationAndFilter(
        pageSize,
        page,
        search
      );

      // Processando dados da rota de paginação
      const paginationData = response.data?.content || {};
      const projectsData = paginationData.projects || []; // Corrigido: 'projects' em vez de 'project'
      const totalProjects = paginationData.total_items || 0;
      const totalPages = paginationData.total_pages || 0;

      setProjects(projectsData);

      setTotalPages(totalPages || 0);
      setTotalProjects(totalProjects || 0);
      setHasMore(currentPage < totalPages);

      // Atualizar a URL com a nova página
      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);

      // Em caso de erro, garantir que projects seja um array vazio
      setProjects([]);
      setTotalPages(0);
      setTotalProjects(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar projetos",
          text: error.message || "Ocorreu um erro inesperado.",
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Sincronizar estado interno com URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  useEffect(() => {
    // Carregar projetos quando a página mudar na URL
    fetchProjects(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Removendo filtro por enquanto - usando todos os projetos
  const projectsToShow = Array.isArray(projects) ? projects : [];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      setCurrentPage(newPage);
      setSearchParams({ page: newPage.toString() });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !loading) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setSearchParams({ page: newPage.toString() });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !loading) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setSearchParams({ page: newPage.toString() });
    }
  };

  // Ações
  const handleCreate = () => {
    navigate("/projectform"); // Ou abrir um modal se quiser
  };

  const handleSelect = (project) => {
    navigate(`/projectpage`, { state: { initial_date: project } });
  };

  const handleEdit = (project) => {
    navigate("/projectform", { state: { initial_date: project } });
  };

  const handleDelete = async (project) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o projeto "${project.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await projectApi.deleteProject({ project_id: project.id });
      Swal.fire("Excluído!", "O projeto foi removido com sucesso.", "success");
      // Recarregar os dados após exclusão
      fetchProjects(currentPage, searchTerm);
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      Swal.fire("Erro!", "Erro ao deletar projeto.", "error");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset para primeira página quando buscar
    setSearchParams({ page: "1" }); // Atualizar URL para página 1
  };

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent pageTitle="" />
      ) : (
        <ProjectListContent
          projects={projectsToShow}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          onBack={() => navigate(-1)}
          onPageChange={handlePageChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSearch={handleSearch}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProjects={totalProjects}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}
