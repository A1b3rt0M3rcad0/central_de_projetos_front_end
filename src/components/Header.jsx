import { useState } from "react";
import { Settings, Bell, Search } from "lucide-react";

export default function Header({ pageTitle }) {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between z-30">
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* Desktop Search + Icons */}
      <div className="hidden md:flex items-center gap-5">
        <input
          type="search"
          placeholder="Buscar projeto"
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />
        <button
          aria-label="Notificações"
          className="relative p-2 rounded-md hover:bg-indigo-50 transition"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          aria-label="Configurações"
          className="p-2 rounded-md hover:bg-indigo-50 transition"
        >
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Search Toggle + Icons */}
      <div className="flex md:hidden items-center gap-3">
        <button
          aria-label="Buscar"
          className="p-2 rounded-md hover:bg-indigo-50 transition"
          onClick={() => setShowSearchMobile(!showSearchMobile)}
        >
          <Search className="w-6 h-6 text-gray-700" />
        </button>

        <button
          aria-label="Notificações"
          className="relative p-2 rounded-md hover:bg-indigo-50 transition"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button
          aria-label="Configurações"
          className="p-2 rounded-md hover:bg-indigo-50 transition"
        >
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Search Input Slide Down */}
      {showSearchMobile && (
        <div className="absolute top-full left-0 right-0 bg-white px-6 py-3 border-t border-b border-gray-200 md:hidden shadow-md z-20">
          <input
            type="search"
            placeholder="Buscar projeto"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            autoFocus
            onBlur={() => setShowSearchMobile(false)}
          />
        </div>
      )}
    </header>
  );
}
