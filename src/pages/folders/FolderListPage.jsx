import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import FolderListContent from "../../features/contents/FolderListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import folderAPI from "../../services/api/folder";
import Swal from "sweetalert2";

export default function FolderListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [folders, setFolders] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalFolders, setTotalFolders] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10;

  const fetchFolders = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      const response = await folderAPI.getFoldersWithPaginationAndFilter(
        pageSize,
        page,
        search
      );

      const paginationData = response.data?.content || {};
      const foldersData = paginationData.folders || [];
      const totalFoldersCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setFolders(foldersData);
      setTotalPages(totalPagesCount || 0);
      setTotalFolders(totalFoldersCount || 0);
      setHasMore(currentPage < totalPagesCount);

      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar pastas:", error);
      setFolders([]);
      setTotalPages(0);
      setTotalFolders(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar pastas",
          text: error.message || "Ocorreu um erro inesperado.",
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFolders(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Sincronizar estado interno com URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  const foldersToShow = Array.isArray(folders) ? folders : [];

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
    navigate("/folderform");
  };

  const handleView = (folder) => {
    navigate("/folderview", { state: { item: folder } });
  };

  const handleEdit = (folder) => {
    navigate(`/folderform`, { state: { initial_date: folder } });
  };

  const handleDelete = async (folder) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir a pasta "${folder.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await folderAPI.deleteFolder({ folder_id: folder.id });
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));
      fetchFolders(currentPage, searchTerm); // Recarregar a página atual após exclusão
      Swal.fire("Excluído!", "A pasta foi removida com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", "Erro ao deletar pasta.", "error");
      } else {
        Swal.fire(
          "Info!",
          "Não foi possivel deletar pasta, pois ela já está associada a um projeto!",
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
        <FolderListContent
          folders={foldersToShow}
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
          totalFolders={totalFolders}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}

