import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import TipoListContent from "../contents/TipoListContent";
import LoadingContent from "../contents/LoadingContent";
import tipoAPI from "../services/endpoints/tipo";
import Swal from "sweetalert2";

export default function TipoListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await tipoAPI.getAllTipos();
        const content = response.data.content;
        setTipos(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar tipos",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredTipos = tipos.filter((tipo) =>
    (tipo.name || "").toLowerCase().includes(filter.toLowerCase())
  );

  // Ações
  const handleCreate = () => {
    navigate("/tipoform");
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
      setTipos((prev) => prev.filter((c) => c.id !== tipo.id));
      Swal.fire("Excluído!", "O Tipo foi removido com sucesso.", "success");
    } catch (error) {
      Swal.fire("Erro!", "Erro ao deletar tipo.", "error");
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
        <TipoListContent
          tipos={filteredTipos}
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
