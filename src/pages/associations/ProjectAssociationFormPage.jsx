import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAssociationForm from "../../features/forms/ProjectAssociationForm";
import BasePage from "../../components/layout/BasePage";
import projectAPI from "../../services/api/project";

export default function ProjectAssociationFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.initial_date;

  const [initialData, setInitialData] = useState(null);
  const [listas, setListas] = useState({
    types: [],
    users: [],
    bairros: [],
    empresas: [],
    fiscais: [],
  });

  useEffect(() => {
    async function loadAll() {
      if (!data?.id) return;

      try {
        const [projRes, possRes] = await Promise.all([
          projectAPI.getProjectWithDetails(data.id),
          projectAPI.getAllPossiblyAssociationsFromProject(),
        ]);

        const project = projRes.data.content;
        const poss = possRes.data.content;

        if (project && poss) {
          const associations = {
            types: project.types ? [project.types.id] : [],
            users: project.user ? [project.user.cpf] : [],
            bairros: project.bairro ? [project.bairro.id] : [],
            empresas: project.empresa ? [project.empresa.id] : [],
            fiscais: project.fiscal ? [project.fiscal.id] : [],
          };

          setInitialData({
            id: project.id,
            associations,
          });

          setListas({
            types: poss.type || [],
            users: poss.vereador || [],
            bairros: poss.bairro || [],
            empresas: poss.empresa || [],
            fiscais: poss.fiscal || [],
          });
        }
      } catch (err) {
        console.error("Erro ao carregar associações:", err);
      }
    }

    loadAll();
  }, [data]);

  return (
    <BasePage pageTitle="Gerenciar Associações">
      <ProjectAssociationForm
        initial_data={initialData}
        listas={listas}
        onBack={() => navigate(-1)}
        onAssociate={{
          types: async (id) =>
            await projectAPI.postProjectTypeAssociation(id, initialData.id),
          users: async (cpf) =>
            await projectAPI.postUserProjectAssociation(cpf, initialData.id),
          bairros: async (id) =>
            await projectAPI.postProjectBairroAssociation(id, initialData.id),
          empresas: async (id) =>
            await projectAPI.postProjectEmpresaAssociation(id, initialData.id),
          fiscais: async (id) =>
            await projectAPI.postProjectFiscalAssociation(id, initialData.id),
        }}
        onDissociate={{
          types: async (id) =>
            await projectAPI.deleteProjectTypeAssociation(id, initialData.id),
          users: async (cpf) =>
            await projectAPI.deleteUserProjectAssociation(cpf, initialData.id),
          bairros: async (id) =>
            await projectAPI.deleteProjectBairroAssociation(id, initialData.id),
          empresas: async (id) =>
            await projectAPI.deleteProjectEmpresaAssociation(
              id,
              initialData.id
            ),
          fiscais: async (id) =>
            await projectAPI.deleteProjectFiscalAssociation(id, initialData.id),
        }}
      />
    </BasePage>
  );
}
