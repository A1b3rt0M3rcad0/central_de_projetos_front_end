import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import BairroListContent from "../contents/BairroListContent";
import LoadingContent from "../contents/LoadingContent";
import bairroAPI from "../services/endpoints/bairro";
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
    navigate("/empresaform");
  };

  const handleEdit = (bairro) => {
    navigate(`/empresaform`, { state: { initial_date: company } });
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
      setCompanies((prev) => prev.filter((c) => c.id !== bairro.id));
      Swal.fire("Excluído!", "O Bairro foi removido com sucesso.", "success");
    } catch (error) {
      Swal.fire("Erro!", "Erro ao deletar bairro.", "error");
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
