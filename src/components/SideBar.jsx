import { useEffect, useState } from "react";
import logo from "../assets/logo_gov.png";
import {
  User,
  DoorOpen,
  Hammer,
  Menu as MenuIcon,
  X as CloseIcon,
  Building,
  NotebookPen,
  MapPin,
  Users,
  House,
} from "lucide-react";
import SideBarItem from "./SideBarItem";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import userAPI from "../services/endpoints/user";

function SideBar() {
  function abreviarNomeCompleto(nomeCompleto) {
    if (!nomeCompleto) return "";

    const partes = nomeCompleto.trim().split(/\s+/); // remove espaços extras

    if (partes.length === 1) {
      return partes[0]; // Apenas primeiro nome
    }

    if (partes.length === 2) {
      return partes.join(" "); // Primeiro e último
    }

    const primeiro = partes[0];
    const ultimo = partes[partes.length - 1];
    const meios = partes
      .slice(1, -1)
      .map((n) => `${n[0]}.`)
      .join(" ");

    return `${primeiro} ${meios} ${ultimo}`;
  }

  const navigate = useNavigate();
  const Logout = () => {
    localStorage.clear("access_token");
    localStorage.clear("user_info");
    navigate("/");
  };
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user_info");

        let shouldFetch = true;

        if (storedUser) {
          const userParsed = JSON.parse(storedUser);

          if (userParsed.token === accessToken) {
            // Dados ainda válidos, usa do localStorage
            setUserName(abreviarNomeCompleto(userParsed.name));
            setUserRole(userParsed.role);
            shouldFetch = false;
          }
        }

        if (shouldFetch && accessToken) {
          const response = await userAPI.getWhoAmI(accessToken);

          const updatedToken = response.data?.access_token || accessToken;

          if (response.data?.access_token) {
            localStorage.setItem("access_token", updatedToken);
          }

          const newUserInfo = {
            name: response.data.content.name,
            role: response.data.content.role,
            token: updatedToken,
          };

          localStorage.setItem("user_info", JSON.stringify(newUserInfo));

          setUserName(abreviarNomeCompleto(newUserInfo.name));
          setUserRole(newUserInfo.role);
        }
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar informações do usuário",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {/* Botão Hamburguer (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[100] p-2 rounded-md bg-white shadow-md border border-gray-300"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-white border-r border-gray-300 shadow-md
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static md:flex md:w-1/6 md:min-w-[220px]
        `}
      >
        {/* Header */}
        <div className="p-5 pb-3 flex flex-col justify-center items-center border-b border-gray-200">
          <img className="w-[110px]" src={logo} alt="Logo Governo" />
          <p className="px-3 py-2 my-1 rounded-md font-medium">
            Escritório de Projetos
          </p>
        </div>

        {/* Menu */}
        <ul className="flex-1 p-4 space-y-1">
          <SideBarItem
            icon={<House className="text-blue-600" />}
            text="Início"
            onClick={() => navigate("/home")}
          />
          <SideBarItem
            icon={<Hammer className="text-blue-600" />}
            text="Projetos"
            submenu={[
              {
                text: "Lista de Projetos",
                onClick: () => navigate("/projectlistpage"),
              },
              {
                text: "Status",
                onClick: () => console.log("Status"),
              },
              {
                text: "Tipos",
                onClick: () => console.log("Tipos"),
              },
            ]}
          />
          {/* Modificar as Rotas de acesso */}
          <SideBarItem
            icon={<Building className="text-blue-600" />}
            text="Empresas"
            onClick={() => navigate("/empresalistpage")}
          />
          <SideBarItem
            icon={<NotebookPen className="text-blue-600" />}
            text="Fiscais"
            onClick={() => navigate("/fiscallist")}
          />
          <SideBarItem
            icon={<MapPin className="text-blue-600" />}
            text="Bairros"
          />
          <SideBarItem
            icon={<Users className="text-blue-600" />}
            text="Usuários"
            submenu={[
              {
                text: "Lista de Usuários",
              },
            ]}
          />
        </ul>

        {/* Footer */}
        <div className="border-t border-gray-200 flex items-center p-4 bg-gray-50">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-blue-100 text-blue-700">
            <User />
          </div>
          <div className="flex justify-between items-center flex-1 ml-3">
            <div className="leading-5">
              <h4 className="font-semibold text-gray-800">{userName}</h4>
              <span className="text-xs text-gray-600">{userRole}</span>
            </div>
            <div onClick={Logout} className="cursor-pointer">
              <DoorOpen
                size={20}
                className="text-gray-700 hover:bg-blue-50 rounded-md"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
