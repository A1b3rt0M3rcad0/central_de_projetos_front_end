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
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10;

  const fetchEmpresas = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      const response = await empresaAPI.getEmpresasWithPaginationAndFilter(
        pageSize,
        page,
        search
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
    fetchEmpresas(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Sincronizar estado interno com URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  const companiesToShow = Array.isArray(companies) ? companies : [];

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
      fetchEmpresas(currentPage, searchTerm); // Recarregar a página atual após exclusão
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
        <EmpresaListContent
          companies={companiesToShow}
          onCreate={handleCreate}
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
          totalCompanies={totalCompanies}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}
