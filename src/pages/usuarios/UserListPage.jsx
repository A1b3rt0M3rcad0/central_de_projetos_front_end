import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import UserListContent from "../../features/contents/UserListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import userApi from "../../services/api/user";
import Swal from "sweetalert2";

export default function UserListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUser();
        const content = response.data.content;
        setUsers(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar usuários",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredUsers = users.filter((user) =>
    (user?.name || "").toLowerCase().includes(filter.toLowerCase())
  );

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
      setUsers((prev) => prev.filter((c) => c.cpf !== user.cpf));
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

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent />
      ) : (
        <UserListContent
          users={filteredUsers}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFilter={handleFilter}
          onBack={() => navigate(-1)}
        />
      )}
    </BasePage>
  );
}
