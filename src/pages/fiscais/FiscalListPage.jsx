import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import FiscalListContent from "../../features/contents/FiscalListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import fiscalAPI from "../../services/api/fiscal";
import Swal from "sweetalert2";

export default function FiscalListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [fiscais, setFiscais] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalFiscais, setTotalFiscais] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const pageSize = 10;

  const fetchFiscais = async (page = 1) => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      const response = await fiscalAPI.getFiscaisWithPagination(pageSize, page);

      const paginationData = response.data?.content || {};
      const fiscaisData = paginationData.fiscais || [];
      const totalFiscaisCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setFiscais(fiscaisData);
      setTotalPages(totalPagesCount || 0);
      setTotalFiscais(totalFiscaisCount || 0);
      setHasMore(currentPage < totalPagesCount);

      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar fiscais:", error);
      setFiscais([]);
      setTotalPages(0);
      setTotalFiscais(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar fiscais",
          text: error.message || "Ocorreu um erro inesperado.",
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFiscais(currentPage);
  }, [currentPage]);

  const fiscaisToShow = Array.isArray(fiscais) ? fiscais : [];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Ações
  const handleCreate = () => {
    navigate("/fiscalform");
  };

  const handleEdit = (fiscal) => {
    navigate("/fiscalform", { state: { initial_data: fiscal } });
  };

  const handleDelete = async (fiscal) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o fiscal "${fiscal.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await fiscalAPI.deleteFiscal({ name: fiscal.name });
      fetchFiscais(currentPage); // Recarregar a página atual após exclusão
      Swal.fire("Excluído!", "O fiscal foi removido com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", `Erro ao deletar fiscal.`, "error");
      } else {
        Swal.fire(
          "Info!",
          `Não foi possivel deletar fiscal, pois ele já está associado a um projeto!`,
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
        <FiscalListContent
          fiscais={fiscaisToShow}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={() => navigate(-1)}
          onPageChange={handlePageChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalFiscais={totalFiscais}
        />
      )}
    </BasePage>
  );
}
