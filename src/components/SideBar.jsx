import { useState } from "react";
import logo from "../assets/logo_gov.png";
import {
  User,
  MoreVertical,
  Hammer,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import SideBarItem from "./SideBarItem";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão Hamburguer (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md border border-gray-300"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen
          bg-white border-r border-gray-300 shadow-md
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static md:flex md:w-1/6 md:min-w-[220px]
        `}
      >
        {/* Header */}
        <div className="p-5 pb-3 flex justify-center items-center border-b border-gray-200">
          <img className="w-[110px]" src={logo} alt="Logo Governo" />
        </div>

        {/* Menu */}
        <ul className="flex-1 p-4 space-y-1">
          <SideBarItem
            icon={<Hammer className="text-blue-600" />}
            text="Projetos"
            submenu={[
              { text: "Usuários", onClick: () => console.log("Usuários") },
              { text: "Permissões", onClick: () => console.log("Permissões") },
              { text: "Logs", onClick: () => console.log("Logs") },
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
              <h4 className="font-semibold text-gray-800">****339-70</h4>
              <span className="text-xs text-gray-600">ADMIN</span>
            </div>
            <MoreVertical size={20} className="text-gray-500" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
