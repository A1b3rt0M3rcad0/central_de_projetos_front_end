import ProjectForm from "../forms/ProjectForm";
import BasePage from "../components/BasePage";
import { useNavigate } from "react-router-dom";

export default function ProjectFormPage() {
  const navigate = useNavigate();
  return (
    <BasePage pageTitle={""}>
      <ProjectForm
        initialData={{
          id: 1,
          name: "Revitalização Urbana",
          verba_disponivel: 500000,
          andamento_do_projeto: "Em andamento",
          start_date: "2024-01-01",
          expected_completion_date: "2024-12-31",
          end_date: null,
          status: { id: 2, nome: "Ativo" },
          bairro: { id: 3, nome: "Centro" },
          empresa: { id: 5, nome: "Construtora Alpha" },
          tipo: { id: 1, nome: "Infraestrutura" },
          fiscal: { id: 4, nome: "João de souza" },
          documentos: [
            { id: 1, nome: "Memorial Descritivo.pdf", url: "#" },
            { id: 2, nome: "Orçamento.xlsx", url: "#" },
          ],
          historico: [
            {
              id: 1,
              data_name: "Status",
              description: "Projeto iniciado",
              updated_at: "2024-01-01",
            },
            {
              id: 2,
              data_name: "Verba",
              description: "Verba adicionada",
              updated_at: "2024-03-01",
            },
          ],
        }}
        statusOptions={[
          { id: 1, nome: "Planejado" },
          { id: 2, nome: "Ativo" },
          { id: 3, nome: "Concluído" },
        ]}
        bairroOptions={[
          { id: 1, nome: "Centro" },
          { id: 2, nome: "Jardim" },
          { id: 3, nome: "Boa Vista" },
        ]}
        empresaOptions={[
          { id: 5, nome: "Construtora Alpha" },
          { id: 6, nome: "Beta Engenharia" },
        ]}
        tipoOptions={[
          { id: 1, nome: "Infraestrutura" },
          { id: 2, nome: "Urbanismo" },
        ]}
        fiscalOptions={[
          { id: 4, nome: "João de souza" },
          { id: 7, nome: "Maria Oliveira" },
        ]}
        onSubmit={(data) => console.log("Enviar:", data)}
        onBack={() => navigate(-1)}
      />
    </BasePage>
  );
}
