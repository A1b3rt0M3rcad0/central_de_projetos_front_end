import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../config/constants";
import AuthGuard from "../components/auth/AuthGuard";
import ErrorBoundary from "../components/ui/ErrorBoundary";

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
import ProjectHistoryPage from "../pages/projects/ProjectHistoryPage";
import WorkProjectListPage from "../pages/projects/WorkProjectListPage";
import WorkProjectViewPage from "../pages/projects/WorkProjectViewPage";
import EAPPage from "../pages/projects/EAPPage";
import EAPTreeViewPage from "../pages/projects/EAPTreeViewPage";

// Empresa Pages
import EmpresaListPage from "../pages/empresas/EmpresaListPage";
import EmpresaFormPage from "../pages/empresas/EmpresaFormPage";
import EmpresaViewPage from "../pages/empresas/EmpresaViewPage";

// Fiscal Pages
import FiscalListPage from "../pages/fiscais/FiscalListPage";
import FiscalFormPage from "../pages/fiscais/FiscalFormPage";
import FiscalViewPage from "../pages/fiscais/FiscalViewPage";

// Bairro Pages
import BairroListPage from "../pages/bairros/BairroListPage";
import BairroFormPage from "../pages/bairros/BairroFormPage";
import BairroViewPage from "../pages/bairros/BairroViewPage";

// User Pages
import UserListPage from "../pages/usuarios/UserListPage";
import UserFormPage from "../pages/usuarios/UserFormPage";

// Status Pages
import StatusListPage from "../pages/status/StatusListPage";
import StatusFormPage from "../pages/status/StatusFormPage";
import StatusViewPage from "../pages/status/StatusViewPage";

// Tipo Pages
import TipoListPage from "../pages/tipos/TipoListPage";
import TipoFormPage from "../pages/tipos/TipoFormPage";
import TipoViewPage from "../pages/tipos/TipoViewPage";

// Document Pages
import DocumentFormPage from "../pages/documents/DocumentFormPage";

// Association Pages
import ProjectAssociationFormPage from "../pages/associations/ProjectAssociationFormPage";

// Notification Pages
import NotificationPage from "../pages/notifications/NotificationPage";

// Settings Pages
import SettingsPage from "../pages/settings/SettingsPage";

// Help Pages
import HelpPage from "../pages/help/HelpPage";

// Fiscal Pages
import FiscalAuthGuard from "../dashboard_fiscal/components/FiscalAuthGuard";
import FiscalLoginPage from "../dashboard_fiscal/pages/FiscalLoginPage";
import FiscalDashboardPage from "../dashboard_fiscal/pages/FiscalDashboardPage";
import FiscalProfilePage from "../dashboard_fiscal/pages/FiscalProfilePage";
import FiscalProjectsPage from "../dashboard_fiscal/pages/FiscalProjectsPage";
import FiscalWorkProjectsPage from "../dashboard_fiscal/pages/FiscalWorkProjectsPage";
import CreateWorkProjectPage from "../dashboard_fiscal/pages/CreateWorkProjectPage";
import FiscalWorkProjectViewPage from "../dashboard_fiscal/pages/WorkProjectViewPage";
import AllWorkProjectsPage from "../dashboard_fiscal/pages/AllWorkProjectsPage";

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
      <ErrorBoundary>
        <AuthGuard>
          <HomePage />
        </AuthGuard>
      </ErrorBoundary>
    ),
  },
  // Project Routes
  {
    path: ROUTES.PROJECTS.LIST,
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <ProjectListPage />
        </AuthGuard>
      </ErrorBoundary>
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
      <ErrorBoundary>
        <AuthGuard>
          <ProjectViewPage />
        </AuthGuard>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.PROJECTS.HISTORY,
    element: (
      <AuthGuard>
        <ProjectHistoryPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.PROJECTS.WORK_PROJECTS,
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <WorkProjectListPage />
        </AuthGuard>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.PROJECTS.WORK_PROJECT_VIEW,
    element: (
      <AuthGuard>
        <WorkProjectViewPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.PROJECTS.EAP,
    element: (
      <AuthGuard>
        <EAPPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.PROJECTS.EAP_TREE_VIEW,
    element: (
      <AuthGuard>
        <EAPTreeViewPage />
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
  {
    path: ROUTES.EMPRESAS.VIEW,
    element: (
      <AuthGuard>
        <EmpresaViewPage />
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
  {
    path: ROUTES.FISCAIS.VIEW,
    element: (
      <AuthGuard>
        <FiscalViewPage />
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
  {
    path: ROUTES.BAIRROS.VIEW,
    element: (
      <AuthGuard>
        <BairroViewPage />
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
  {
    path: ROUTES.STATUS.VIEW,
    element: (
      <AuthGuard>
        <StatusViewPage />
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
  {
    path: ROUTES.TIPOS.VIEW,
    element: (
      <AuthGuard>
        <TipoViewPage />
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
  // Notification Routes
  {
    path: ROUTES.NOTIFICATIONS.LIST,
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <NotificationPage />
        </AuthGuard>
      </ErrorBoundary>
    ),
  },
  // Settings Routes
  {
    path: "/settings",
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      </ErrorBoundary>
    ),
  },
  // Help Routes
  {
    path: ROUTES.HELP,
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <HelpPage />
        </AuthGuard>
      </ErrorBoundary>
    ),
  },
  // Fiscal Routes
  {
    path: ROUTES.FISCAL.LOGIN,
    element: (
      <FiscalAuthGuard requireAuth={false}>
        <FiscalLoginPage />
      </FiscalAuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAL.DASHBOARD,
    element: (
      <ErrorBoundary>
        <FiscalAuthGuard>
          <FiscalDashboardPage />
        </FiscalAuthGuard>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.FISCAL.PROFILE,
    element: (
      <FiscalAuthGuard>
        <FiscalProfilePage />
      </FiscalAuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAL.PROJECTS,
    element: (
      <FiscalAuthGuard>
        <FiscalProjectsPage />
      </FiscalAuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAL.WORK_PROJECTS,
    element: (
      <FiscalAuthGuard>
        <AllWorkProjectsPage />
      </FiscalAuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAL.PROJECT_WORK_PROJECTS,
    element: (
      <FiscalAuthGuard>
        <FiscalWorkProjectsPage />
      </FiscalAuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAL.CREATE_WORK_PROJECT,
    element: (
      <FiscalAuthGuard>
        <CreateWorkProjectPage />
      </FiscalAuthGuard>
    ),
  },
  {
    path: ROUTES.FISCAL.WORK_PROJECT_VIEW,
    element: (
      <FiscalAuthGuard>
        <FiscalWorkProjectViewPage />
      </FiscalAuthGuard>
    ),
  },
]);

export default router;
