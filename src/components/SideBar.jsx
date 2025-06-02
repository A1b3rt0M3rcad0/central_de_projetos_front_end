import { useState } from "react";
import logo from "../assets/logo_gov.png";
import {
  ChevronFirst,
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-sm"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen 
          bg-white border-r shadow-sm
          flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 
          md:static md:flex md:w-1/6 md:min-w-[200px]
        `}
      >
        {/* Header */}
        <div className="p-4 pb-2 flex justify-center items-center relative border-b">
          <img className="w-[100px]" src={logo} alt="Logo" />
        </div>

        {/* Menu */}
        <ul className="flex-1 p-3">
          <SideBarItem
            icon={<Hammer />}
            text="Projetos"
            submenu={[
              { text: "Usuários", onClick: () => console.log("Usuários") },
              { text: "Permissões", onClick: () => console.log("Permissões") },
              { text: "Logs", onClick: () => console.log("Logs") },
            ]}
          />
        </ul>

        {/* Footer */}
        <div className="border-t flex items-center p-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-100">
            <User />
          </div>
          <div className="flex justify-between items-center flex-1 ml-3">
            <div className="leading-4">
              <h4 className="font-semibold">****339-70</h4>
              <span className="text-xs text-gray-600">ADMIN</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
