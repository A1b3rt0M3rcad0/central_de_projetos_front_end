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
    element: <ProjectPage />,
  },
  {
    path: "/projectlistpage",
    element: <ProjectListPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/projectform",
    element: <ProjectFormPage />,
  },
  {
    path: "/empresalistpage",
    element: <EmpresaListPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
