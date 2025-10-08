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
  ChevronRight,
} from "lucide-react";
import SideBarItem from "./SideBarItem";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import userAPI from "../services/api/user";
import { usePermissions, ROLE_DESCRIPTIONS } from "../hooks/usePermissions";

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

  // Hook de permissões
  const permissions = usePermissions(userRole);

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

  // Obter informações de exibição do role
  const roleInfo = ROLE_DESCRIPTIONS[userRole?.toUpperCase()] || {
    label: userRole,
    description: '',
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Botão Hamburguer (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[100] p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:bg-white transition-all duration-200"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? (
          <CloseIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm
          border-r border-gray-200/50
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static md:flex md:w-80 md:min-w-[280px]
          md:shadow-xl
        `}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex flex-col justify-center items-center border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="relative">
            <img
              className="w-[120px] drop-shadow-sm"
              src={logo}
              alt="Logo Governo"
            />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
          <h1 className="mt-4 text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Escritório de Projetos
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sistema de Gestão</p>
        </div>

        {/* Menu */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {/* Dashboard - Todos */}
            <SideBarItem
              icon={<House className="w-5 h-5" />}
              text="Início"
              onClick={() => navigate("/home")}
            />

            {/* Projetos - Todos podem ver */}
            <SideBarItem
              icon={<Hammer className="w-5 h-5" />}
              text="Projetos"
              submenu={[
                {
                  text: "Lista de Projetos",
                  onClick: () => navigate("/projectlistpage"),
                },
                ...(permissions.canViewStatus ? [{
                  text: "Status",
                  onClick: () => navigate("/statuslist"),
                }] : []),
                ...(permissions.canViewTipos ? [{
                  text: "Tipos",
                  onClick: () => navigate("/tipolist"),
                }] : []),
              ]}
            />

            {/* Empresas - Todos podem ver */}
            {permissions.canViewEmpresas && (
              <SideBarItem
                icon={<Building className="w-5 h-5" />}
                text="Empresas"
                onClick={() => navigate("/empresalistpage")}
              />
            )}

            {/* Fiscais - Todos podem ver */}
            {permissions.canViewFiscais && (
              <SideBarItem
                icon={<NotebookPen className="w-5 h-5" />}
                text="Fiscais"
                onClick={() => navigate("/fiscallist")}
              />
            )}

            {/* Bairros - Todos podem ver */}
            {permissions.canViewBairros && (
              <SideBarItem
                icon={<MapPin className="w-5 h-5" />}
                text="Bairros"
                onClick={() => navigate("/bairrolist")}
              />
            )}

            {/* Usuários - Apenas ADMIN */}
            {permissions.canViewUsers && (
              <SideBarItem
                icon={<Users className="w-5 h-5" />}
                text="Usuários"
                submenu={[
                  {
                    text: "Lista de Usuários",
                    onClick: () => navigate("/userlist"),
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm p-4">
          <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <div className="flex justify-between items-center flex-1 ml-3">
              <div className="leading-5">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {userName}
                </h4>
                <span className={`text-xs font-medium ${roleInfo.color || 'text-gray-600'}`}>
                  {roleInfo.label || userRole}
                </span>
              </div>
              <button
                onClick={Logout}
                className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                title="Sair do sistema"
              >
                <DoorOpen
                  size={18}
                  className="text-gray-600 group-hover:text-red-600 transition-colors"
                />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
