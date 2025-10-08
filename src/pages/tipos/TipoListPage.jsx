import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import TipoListContent from "../../features/contents/TipoListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import tipoAPI from "../../services/api/tipo";
import Swal from "sweetalert2";

export default function TipoListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estados para paginação
  const [tipos, setTipos] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalTipos, setTotalTipos] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10; // Valor constante para simplificar

  const fetchTipos = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      // Usando a rota de paginação com filtro
      const response = await tipoAPI.getTiposWithPaginationAndFilter(
        pageSize,
        page,
        search
      );

      // Processando dados da rota de paginação
      const paginationData = response.data?.content || {};
      const tiposData = paginationData.types || [];
      const totalTiposCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setTipos(tiposData);
      setTotalPages(totalPagesCount || 0);
      setTotalTipos(totalTiposCount || 0);
      setHasMore(currentPage < totalPagesCount);

      // Atualizar a URL com a nova página
      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar tipos:", error);

      // Em caso de erro, garantir que tipos seja um array vazio
      setTipos([]);
      setTotalPages(0);
      setTotalTipos(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar tipos",
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
    // Carregar tipos quando a página mudar na URL
    fetchTipos(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Removendo filtro por enquanto - usando todos os tipos
  const tiposToShow = Array.isArray(tipos) ? tipos : [];

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
    navigate("/tipoform");
  };

  const handleView = (tipo) => {
    navigate("/tipoview", { state: { item: tipo } });
  };

  const handleEdit = (tipo) => {
    navigate(`/tipoform`, { state: { initial_date: tipo } });
  };

  const handleDelete = async (tipo) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o tipo "${tipo.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await tipoAPI.deleteTipo({ name: tipo.name });
      // Recarregar a página atual após exclusão
      fetchTipos(currentPage, searchTerm);
      Swal.fire("Excluído!", "O Tipo foi removido com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", "Erro ao deletar tipo.", "error");
      } else {
        Swal.fire(
          "Info!",
          "Não foi possivel deletar tipo, pois ele já está associado a um projeto!",
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
        <TipoListContent
          tipos={tiposToShow}
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
          totalTipos={totalTipos}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}
