function SideBarSubItem({ text, onClick }) {
  return (
    <li
      onClick={onClick}
      className="
        px-4 py-2.5 rounded-lg text-sm font-medium
        text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
        cursor-pointer transition-all duration-200 select-none group
        border-l-2 border-transparent hover:border-blue-300
        hover:shadow-sm
      "
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors duration-200"></div>
        {text}
      </div>
    </li>
  );
}

export default SideBarSubItem;
