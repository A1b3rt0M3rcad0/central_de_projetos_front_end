import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import StatusListContent from "../../features/contents/StatusListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import statusAPI from "../../services/api/status";
import Swal from "sweetalert2";

export default function StatusListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estados para paginação
  const [status, setStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalStatus, setTotalStatus] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10; // Valor constante para simplificar

  const fetchStatus = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      // Usando a rota de paginação com filtro
      const response = await statusAPI.getStatusWithPaginationAndFilter(
        pageSize,
        page,
        search
      );

      // Processando dados da rota de paginação
      const paginationData = response.data?.content || {};
      const statusData = paginationData.status || [];
      const totalStatusCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setStatus(statusData);
      setTotalPages(totalPagesCount || 0);
      setTotalStatus(totalStatusCount || 0);
      setHasMore(currentPage < totalPagesCount);

      // Atualizar a URL com a nova página
      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar status:", error);

      // Em caso de erro, garantir que status seja um array vazio
      setStatus([]);
      setTotalPages(0);
      setTotalStatus(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar status",
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
    // Carregar status quando a página mudar na URL
    fetchStatus(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Removendo filtro por enquanto - usando todos os status
  const statusToShow = Array.isArray(status) ? status : [];

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

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset para primeira página quando buscar
    setSearchParams({ page: "1" }); // Atualizar URL para página 1
  };

  // Ações
  const handleCreate = () => {
    navigate("/statusform");
  };

  const handleView = (st) => {
    navigate("/statusview", { state: { item: st } });
  };

  const handleEdit = (st) => {
    navigate(`/statusform`, { state: { initial_date: st } });
  };

  const handleDelete = async (st) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o status "${st.description}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await statusAPI.deleteStatus({ status_id: st.id });
      // Recarregar a página atual após exclusão
      fetchStatus(currentPage, searchTerm);
      Swal.fire("Excluído!", "O Status foi removido com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", "Erro ao deletar status.", "error");
      } else {
        Swal.fire(
          "Info!",
          "Não foi possivel deletar status, pois ele já está associado a um projeto!",
          "info"
        );
      }
    }
  };

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent pageTitle="" />
      ) : (
        <StatusListContent
          status={statusToShow}
          onCreate={handleCreate}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={() => navigate(-1)}
          onPageChange={handlePageChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSearch={handleSearch}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalStatus={totalStatus}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}
