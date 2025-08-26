import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BairroListContent from "../../features/contents/BairroListContent";
import LoadingContent from "../../features/contents/LoadingContent";
import bairroAPI from "../../services/api/bairro";
import Swal from "sweetalert2";

export default function BairroListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const [bairros, setBairros] = useState([]);

  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const response = await bairroAPI.getAllBairro();
        const content = response.data.content;
        setBairros(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar bairros",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBairros();
  }, []);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredBairros = bairros.filter((bairro) =>
    bairro.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Ações
  const handleCreate = () => {
    navigate("/bairroform");
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
      setBairros((prev) => prev.filter((c) => c.id !== bairro.id));
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

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent />
      ) : (
        <BairroListContent
          bairros={filteredBairros}
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
