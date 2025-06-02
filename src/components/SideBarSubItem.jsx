function SideBarSubItem({ text, onClick }) {
  return (
    <li
      onClick={onClick}
      className="
        px-3 py-2 rounded-md text-sm 
        text-gray-700 hover:bg-blue-100 
        cursor-pointer transition-colors select-none
      "
    >
      {text}
    </li>
  );
}

export default SideBarSubItem;
