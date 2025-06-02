import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SideBarSubItem from "./SideBarSubItem";

function SideBarItem({ icon, text, active, alert, submenu = [] }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const hasSubmenu = submenu.length > 0;

  const toggleSubmenu = () => {
    if (hasSubmenu) setOpen(!open);
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
        onClick={toggleSubmenu}
        className={`
          relative flex items-center gap-4
          px-3 py-2 my-1 rounded-md font-medium cursor-pointer
          transition-colors select-none
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-600"
              : "hover:bg-indigo-50 text-gray-600"
          }
        `}
      >
        {icon}

        <span className="flex-1">{text}</span>

        {hasSubmenu &&
          (open ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}

        {alert && (
          <div className="absolute right-2 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </li>

      {hasSubmenu && (
        <ul
          ref={contentRef}
          style={{
            maxHeight: maxHeight,
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
          className="ml-8 space-y-1"
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
