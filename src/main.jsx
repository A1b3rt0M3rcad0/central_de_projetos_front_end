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
import EmpresaListPage from "./pages/EmpresaListPage";
import AuthMiddleware from "./middlewares/AuthMiddleware";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
    path: "/empresalistpage",
    element: (
      <AuthMiddleware>
        <EmpresaListPage />
      </AuthMiddleware>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
