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
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
