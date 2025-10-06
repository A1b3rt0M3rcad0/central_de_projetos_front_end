import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import UserListContent from "../../features/contents/UserListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import userApi from "../../services/api/user";
import Swal from "sweetalert2";

export default function UserListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10;

  const fetchUsers = async (page = 1, search = "") => {
    try {
      const loadingState = page === 1 ? setLoading : setLoadingMore;
      loadingState(true);

      const response = await userApi.getUsersWithPaginationAndFilter(
        pageSize,
        page,
        search
      );

      const paginationData = response.data?.content || {};
      const usersData = paginationData.users || [];
      const totalUsersCount = paginationData.total_items || 0;
      const totalPagesCount = paginationData.total_pages || 0;

      setUsers(usersData);
      setTotalPages(totalPagesCount || 0);
      setTotalUsers(totalUsersCount || 0);
      setHasMore(currentPage < totalPagesCount);

      setSearchParams({ page: page.toString() });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
      setTotalPages(0);
      setTotalUsers(0);
      setHasMore(false);

      if (!(error.response && error.response.status === 404)) {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar usuários",
          text: error.message || "Ocorreu um erro inesperado.",
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Sincronizar estado interno com URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  const usersToShow = Array.isArray(users) ? users : [];

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
    navigate("/userform");
  };

  const handleEdit = (user) => {
    navigate(`/userform`, { state: { initial_date: user } });
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o usuário "${user?.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await userApi.deleteUser({ cpf: user.cpf });
      fetchUsers(currentPage, searchTerm);
      Swal.fire("Excluído!", "O Usuário foi removido com sucesso.", "success");
    } catch (error) {
      if (error.status != 409) {
        Swal.fire("Erro!", "Erro ao deletar usuário.", "error");
      } else {
        Swal.fire(
          "Info!",
          "Não foi possivel deletar usuário, pois ele já está associado a um projeto!",
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
        <UserListContent
          users={usersToShow}
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
          totalUsers={totalUsers}
          searchTerm={searchTerm}
        />
      )}
    </BasePage>
  );
}
