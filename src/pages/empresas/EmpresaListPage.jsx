import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import EmpresaListContent from "../../features/contents/EmpresaListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import empresaAPI from "../../services/api/empresa";
import Swal from "sweetalert2";

export default function EmpresaListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const pageSize = 10;

  const fetchEmpresas = async (page = 1) => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      const response = await empresaAPI.getEmpresasWithPagination(
        pageSize,
        page
      );

      const paginationData = response.data?.content || {};
      const companiesData = paginationData.empresas || [];
      const totalCompaniesCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setCompanies(companiesData);
      setTotalPages(totalPagesCount || 0);
      setTotalCompanies(totalCompaniesCount || 0);
      setHasMore(currentPage < totalPagesCount);

      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      setCompanies([]);
      setTotalPages(0);
      setTotalCompanies(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar empresas",
          text: error.message || "Ocorreu um erro inesperado.",
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEmpresas(currentPage);
  }, [currentPage]);

  const companiesToShow = Array.isArray(companies) ? companies : [];

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
    navigate("/empresaform");
  };

  const handleEdit = (company) => {
    navigate(`/empresaform`, { state: { initial_date: company } });
  };

  const handleDelete = async (company) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir a empresa "${company.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await empresaAPI.deleteEmpresa({ name: company.name });
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
      fetchEmpresas(currentPage); // Recarregar a página atual após exclusão
      Swal.fire("Excluído!", "A empresa foi removido com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", "Erro ao deletar empresa.", "error");
      } else {
        Swal.fire(
          "Info!",
          "Não foi possivel deletar empresa, pois ela já está associada a um projeto!",
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
        <EmpresaListContent
          companies={companiesToShow}
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
          totalCompanies={totalCompanies}
        />
      )}
    </BasePage>
  );
}
