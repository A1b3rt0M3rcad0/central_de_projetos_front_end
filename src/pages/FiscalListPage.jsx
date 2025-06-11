import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import FiscalListContent from "../contents/FiscalListContent";
import LoadingContent from "../contents/LoadingContent";
import fiscalAPI from "../services/endpoints/fiscal";
import Swal from "sweetalert2";

export default function FiscalListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Estado de fiscais
  const [fiscais, setFiscais] = useState([]);

  useEffect(() => {
    const fetchFiscais = async () => {
      try {
        const response = await fiscalAPI.getAllFiscais();
        const content = response.data.content;
        setFiscais(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar fiscais",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFiscais();
  }, []);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredFiscais = fiscais.filter((f) =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  );

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
      await fiscalAPI.deleteFiscal({ id: fiscal.id });
      setFiscais((prev) => prev.filter((f) => f.id !== fiscal.id));
      Swal.fire("Excluído!", "O fiscal foi removido com sucesso.", "success");
    } catch (error) {
      Swal.fire("Erro!", "Erro ao deletar fiscal.", "error");
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
        <FiscalListContent
          fiscais={filteredFiscais}
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
