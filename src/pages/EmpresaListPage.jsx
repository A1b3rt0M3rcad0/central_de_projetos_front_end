import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import EmpresaListContent from "../contents/EmpresaListContent";

export default function EmpresaListPage() {
  const navigate = useNavigate();

  // Dados mockados
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Construtora Alpha",
      created_at: "2023-01-15T10:30:00",
    },
    {
      id: 2,
      name: "Engenharia Beta",
      created_at: "2023-03-22T09:45:00",
    },
    {
      id: 3,
      name: "Serviços Gamma Ltda",
      created_at: "2024-02-10T14:15:00",
    },
  ]);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Ações
  const handleCreate = () => {
    navigate("/companyform");
  };

  const handleSelect = (company) => {
    navigate(`/company/${company.id}`);
  };

  const handleEdit = (company) => {
    navigate(`/company/${company.id}/edit`);
  };

  const handleDelete = (company) => {
    const confirm = window.confirm(
      `Deseja realmente excluir a empresa "${company.name}"?`
    );
    if (confirm) {
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <BasePage pageTitle="">
      <EmpresaListContent
        companies={filteredCompanies}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilter={handleFilter}
        onSelect={handleSelect}
        onBack={() => navigate(-1)}
      />
    </BasePage>
  );
}
