import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import StatusListContent from "../contents/StatusListContent";
import LoadingContent from "../contents/LoadingContent";
import statusAPI from "../services/endpoints/status";
import Swal from "sweetalert2";

export default function StatusListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await statusAPI.getAllStatus();
        const content = response.data.content;
        setStatus(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar status",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredStatus = status.filter((st) =>
    st.description.toLowerCase().includes(filter.toLowerCase())
  );

  // Ações
  const handleCreate = () => {
    navigate("/statusform");
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
      setStatus((prev) => prev.filter((c) => c.id !== st.id));
      Swal.fire("Excluído!", "O Status foi removido com sucesso.", "success");
    } catch (error) {
      Swal.fire("Erro!", "Erro ao deletar status.", "error");
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
        <StatusListContent
          status={filteredStatus}
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
