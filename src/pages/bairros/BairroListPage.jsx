import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BairroListContent from "../../features/contents/BairroListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import bairroAPI from "../../services/api/bairro";
import Swal from "sweetalert2";

export default function BairroListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [bairros, setBairros] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalBairros, setTotalBairros] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10;

  const fetchBairros = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      const response = await bairroAPI.getBairrosWithPaginationAndFilter(
        pageSize,
        page,
        search
      );

      const paginationData = response.data?.content || {};
      const bairrosData = paginationData.bairros || [];
      const totalBairrosCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setBairros(bairrosData);
      setTotalPages(totalPagesCount || 0);
      setTotalBairros(totalBairrosCount || 0);
      setHasMore(currentPage < totalPagesCount);

      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar bairros:", error);
      setBairros([]);
      setTotalPages(0);
      setTotalBairros(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar bairros",
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
    fetchBairros(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const bairrosToShow = Array.isArray(bairros) ? bairros : [];

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
    navigate("/bairroform");
  };

  const handleView = (bairro) => {
    navigate("/bairroview", { state: { item: bairro } });
  };

  const handleEdit = (bairro) => {
    navigate(`/bairroform`, { state: { initial_date: bairro } });
  };

  const handleDelete = async (bairro) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o bairro "${bairro.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await bairroAPI.deleteBairro({ name: bairro.name });
      fetchBairros(currentPage, searchTerm); // Recarregar a página atual após exclusão
      Swal.fire("Excluído!", "O Bairro foi removido com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", "Erro ao deletar bairro.", "error");
      } else {
        Swal.fire(
          "Info!",
          "Não foi possivel deletar bairro, pois ele já está associado a um projeto!",
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
        <BairroListContent
          bairros={bairrosToShow}
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
          totalBairros={totalBairros}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}
