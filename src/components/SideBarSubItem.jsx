function SideBarSubItem({ text, onClick }) {
  return (
    <li
      onClick={onClick}
      className="
        px-3 py-1 rounded-md text-sm 
        text-gray-600 hover:bg-indigo-50 
        cursor-pointer transition-colors select-none
      "
    >
      {text}
    </li>
  );
}

export default SideBarSubItem;
