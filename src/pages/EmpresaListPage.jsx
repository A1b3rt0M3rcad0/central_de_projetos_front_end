import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import EmpresaListContent from "../contents/EmpresaListContent";
import LoadingContent from "../contents/LoadingContent";
import empresaAPI from "../services/endpoints/empresa";
import Swal from "sweetalert2";

export default function EmpresaListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await empresaAPI.getAllEmpresas();
        const content = response.data.content;
        setCompanies(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar projetos",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredCompanies = companies.filter((company) =>
    (company.name || "").toLowerCase().includes(filter.toLowerCase())
  );

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

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent />
      ) : (
        <EmpresaListContent
          companies={filteredCompanies}
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
