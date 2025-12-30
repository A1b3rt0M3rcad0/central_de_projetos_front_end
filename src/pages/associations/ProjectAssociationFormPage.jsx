import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAssociationForm from "../../features/forms/ProjectAssociationForm";
import BasePage from "../../components/layout/BasePage";
import projectAPI from "../../services/api/project";
import folderAPI from "../../services/api/folder";

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
    folders: [],
  });

  useEffect(() => {
    async function loadAll() {
      if (!data?.id) return;

      try {
        const [projRes, possRes, foldersRes] = await Promise.all([
          projectAPI.getProjectWithDetails(data.id),
          projectAPI.getAllPossiblyAssociationsFromProject(),
          folderAPI.getAllFolders(),
        ]);

        const project = projRes.data.content;
        const poss = possRes.data.content;

        if (project && poss) {
          // Buscar pastas do projeto
          let foldersFromProject = [];
          try {
            const foldersRes = await projectAPI.getFoldersByProject(project.id);
            foldersFromProject = foldersRes.data.content || [];
          } catch (err) {
            console.error("Erro ao carregar pastas do projeto:", err);
          }

          const associations = {
            types: project.types
              ? Array.isArray(project.types)
                ? project.types.map((t) => t.id)
                : [project.types.id]
              : [],
            users: project.user ? [project.user.cpf] : [],
            bairros: project.bairro
              ? Array.isArray(project.bairro)
                ? project.bairro.map((b) => b.id)
                : [project.bairro.id]
              : [],
            empresas: project.empresa
              ? Array.isArray(project.empresa)
                ? project.empresa.map((e) => e.id)
                : [project.empresa.id]
              : [],
            fiscais: project.fiscal
              ? Array.isArray(project.fiscal)
                ? project.fiscal.map((f) => f.id)
                : [project.fiscal.id]
              : [],
            folders: foldersFromProject.map((f) => f.id),
          };

          setInitialData({
            id: project.id,
            associations,
          });

          const foldersList = foldersRes.data.content || [];
          setListas({
            types: poss.type || [],
            users: poss.vereador || [],
            bairros: poss.bairro || [],
            empresas: poss.empresa || [],
            fiscais: poss.fiscal || [],
            folders: foldersList.map((f) => ({ id: f.id, name: f.name })) || [],
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
          folders: async (id) =>
            await projectAPI.postProjectFolderAssociation(id, initialData.id),
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
          folders: async (id) =>
            await projectAPI.deleteProjectFolderAssociation(id, initialData.id),
        }}
      />
    </BasePage>
  );
}
