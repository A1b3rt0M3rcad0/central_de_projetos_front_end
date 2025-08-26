import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SideBarSubItem from "./SideBarSubItem";

function SideBarItem({
  icon,
  text,
  active,
  alert,
  submenu = [],
  onClick = () => {}, // <-- adiciona o onClick para itens sem submenu
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const hasSubmenu = submenu.length > 0;

  const handleClick = () => {
    if (hasSubmenu) {
      setOpen(!open);
    } else {
      onClick(); // <-- executa a ação se não tiver submenu
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      if (open) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight("0px");
      }
    }
  }, [open]);

  return (
    <>
      <li
        onClick={handleClick}
        className={`
          relative flex items-center gap-3
          px-4 py-3 rounded-xl font-medium cursor-pointer
          transition-all duration-200 select-none group
          ${
            active
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
              : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-gray-900 hover:shadow-md"
          }
        `}
      >
        <div
          className={`
          p-1.5 rounded-lg transition-all duration-200
          ${
            active
              ? "bg-white/20 text-white"
              : "text-gray-600 group-hover:text-blue-600 group-hover:bg-blue-100/50"
          }
        `}
        >
          {icon}
        </div>

        <span className="flex-1 font-medium">{text}</span>

        {hasSubmenu && (
          <div
            className={`
            transition-all duration-200
            ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}
          `}
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}

        {alert && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </li>

      {hasSubmenu && (
        <ul
          ref={contentRef}
          style={{
            maxHeight: maxHeight,
            overflow: "hidden",
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className="ml-6 space-y-1 mt-1"
        >
          {submenu.map((item, index) => (
            <SideBarSubItem
              key={index}
              text={item.text}
              onClick={item.onClick}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default SideBarItem;
