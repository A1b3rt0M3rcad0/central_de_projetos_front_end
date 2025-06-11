import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BasePage from "./components/BasePage";
import ProjectPage from "./pages/ProjectPage";
import ProjectListPage from "./pages/ProjectListPage";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectFormPage from "./pages/ProjectFormPage";
import EmpresaFormPage from "./pages/EmpresaFormPage";
import EmpresaListPage from "./pages/EmpresaListPage";
import FiscalListPage from "./pages/FiscalListPage";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import IsAuthenticated from "./middlewares/IsAuthenticated";
import CreateProjectPage from "./pages/CreateProjectPage";
import FiscalFormPage from "./pages/FiscalFormPage";
import BairroListPage from "./pages/BairroListPage";
import BairroFormPage from "./pages/BairroFormPage";
import TipoListPage from "./pages/TipoListPage";
import TipoFormPage from "./pages/TipoFormpage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <IsAuthenticated>
        <Login />
      </IsAuthenticated>
    ),
  },
  {
    path: "/sidebar",
    element: <SideBar />,
  },
  {
    path: "/header",
    element: <Header />,
  },
  {
    path: "/footer",
    element: <Footer />,
  },
  {
    path: "/basepage",
    element: <BasePage />,
  },
  {
    path: "/projectpage",
    element: (
      <AuthMiddleware>
        <ProjectPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/projectlistpage",
    element: (
      <AuthMiddleware>
        <ProjectListPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/home",
    element: (
      <AuthMiddleware>
        <HomePage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/projectform",
    element: (
      <AuthMiddleware>
        <ProjectFormPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/empresaform",
    element: (
      <AuthMiddleware>
        <EmpresaFormPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/empresalistpage",
    element: (
      <AuthMiddleware>
        <EmpresaListPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/create_project",
    element: (
      <AuthMiddleware>
        <CreateProjectPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/fiscallist",
    element: (
      <AuthMiddleware>
        <FiscalListPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/fiscalform",
    element: (
      <AuthMiddleware>
        <FiscalFormPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/bairrolist",
    element: (
      <AuthMiddleware>
        <BairroListPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/bairroform",
    element: (
      <AuthMiddleware>
        <BairroFormPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/tipolist",
    element: (
      <AuthMiddleware>
        <TipoListPage />
      </AuthMiddleware>
    ),
  },
  {
    path: "/tipoform",
    element: (
      <AuthMiddleware>
        <TipoFormPage />
      </AuthMiddleware>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
