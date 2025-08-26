import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../config/constants";
import AuthGuard from "../components/auth/AuthGuard";

// Layout Components
import BasePage from "../components/layout/BasePage";

// Auth Pages
import Login from "../pages/auth/Login";

// Dashboard Pages
import HomePage from "../pages/dashboard/HomePage";

// Project Pages
import ProjectListPage from "../pages/projects/ProjectListPage";
import ProjectFormPage from "../pages/projects/ProjectFormPage";
import ProjectViewPage from "../pages/projects/ProjectViewPage";

// Empresa Pages
import EmpresaListPage from "../pages/empresas/EmpresaListPage";
import EmpresaFormPage from "../pages/empresas/EmpresaFormPage";

// Fiscal Pages
import FiscalListPage from "../pages/fiscais/FiscalListPage";
import FiscalFormPage from "../pages/fiscais/FiscalFormPage";

// Bairro Pages
import BairroListPage from "../pages/bairros/BairroListPage";
import BairroFormPage from "../pages/bairros/BairroFormPage";

// User Pages
import UserListPage from "../pages/usuarios/UserListPage";
import UserFormPage from "../pages/usuarios/UserFormPage";

// Status Pages
import StatusListPage from "../pages/status/StatusListPage";
import StatusFormPage from "../pages/status/StatusFormPage";

// Tipo Pages
import TipoListPage from "../pages/tipos/TipoListPage";
import TipoFormPage from "../pages/tipos/TipoFormPage";

// Document Pages
import DocumentFormPage from "../pages/documents/DocumentFormPage";

// Association Pages
import ProjectAssociationFormPage from "../pages/associations/ProjectAssociationFormPage";

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <AuthGuard requireAuth={false}>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.HOME,
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
  },
  // Project Routes
  {
    path: ROUTES.PROJECTS.LIST,
    element: (
      <AuthGuard>
        <ProjectListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.PROJECTS.CREATE,
    element: (
      <AuthGuard>
        <ProjectFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.PROJECTS.EDIT,
    element: (
      <AuthGuard>
        <ProjectFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.PROJECTS.VIEW,
    element: (
      <AuthGuard>
        <ProjectViewPage />
      </AuthGuard>
    ),
  },
  // Empresa Routes
  {
    path: ROUTES.EMPRESAS.LIST,
    element: (
      <AuthGuard>
        <EmpresaListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.EMPRESAS.CREATE,
    element: (
      <AuthGuard>
        <EmpresaFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.EMPRESAS.EDIT,
    element: (
      <AuthGuard>
        <EmpresaFormPage />
      </AuthGuard>
    ),
  },
  // Fiscal Routes
  {
    path: ROUTES.FISCAIS.LIST,
    element: (
      <AuthGuard>
        <FiscalListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAIS.CREATE,
    element: (
      <AuthGuard>
        <FiscalFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAIS.EDIT,
    element: (
      <AuthGuard>
        <FiscalFormPage />
      </AuthGuard>
    ),
  },
  // Bairro Routes
  {
    path: ROUTES.BAIRROS.LIST,
    element: (
      <AuthGuard>
        <BairroListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.BAIRROS.CREATE,
    element: (
      <AuthGuard>
        <BairroFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.BAIRROS.EDIT,
    element: (
      <AuthGuard>
        <BairroFormPage />
      </AuthGuard>
    ),
  },
  // User Routes
  {
    path: ROUTES.USUARIOS.LIST,
    element: (
      <AuthGuard>
        <UserListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.USUARIOS.CREATE,
    element: (
      <AuthGuard>
        <UserFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.USUARIOS.EDIT,
    element: (
      <AuthGuard>
        <UserFormPage />
      </AuthGuard>
    ),
  },
  // Status Routes
  {
    path: ROUTES.STATUS.LIST,
    element: (
      <AuthGuard>
        <StatusListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.STATUS.CREATE,
    element: (
      <AuthGuard>
        <StatusFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.STATUS.EDIT,
    element: (
      <AuthGuard>
        <StatusFormPage />
      </AuthGuard>
    ),
  },
  // Tipo Routes
  {
    path: ROUTES.TIPOS.LIST,
    element: (
      <AuthGuard>
        <TipoListPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.TIPOS.CREATE,
    element: (
      <AuthGuard>
        <TipoFormPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.TIPOS.EDIT,
    element: (
      <AuthGuard>
        <TipoFormPage />
      </AuthGuard>
    ),
  },
  // Document Routes
  {
    path: ROUTES.DOCUMENTS.CREATE,
    element: (
      <AuthGuard>
        <DocumentFormPage />
      </AuthGuard>
    ),
  },
  // Association Routes
  {
    path: ROUTES.ASSOCIATIONS.PROJECT,
    element: (
      <AuthGuard>
        <ProjectAssociationFormPage />
      </AuthGuard>
    ),
  },
]);

export default router;
