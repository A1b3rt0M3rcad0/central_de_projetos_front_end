import { useState } from "react";
import { Settings, Bell, Search } from "lucide-react";

export default function Header({ pageTitle }) {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-700">{pageTitle}</h1>

      {/* Desktop Search + Icons */}
      <div className="hidden md:flex items-center gap-4">
        <input
          type="search"
          placeholder="Buscar projeto"
          className="border rounded px-3 py-1 text-gray-600 focus:outline-indigo-500"
        />
        <button
          aria-label="Notificações"
          className="relative p-2 rounded hover:bg-gray-100"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          aria-label="Configurações"
          className="p-2 rounded hover:bg-gray-100"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Search Toggle + Icons */}
      <div className="flex md:hidden items-center gap-2">
        {/* Toggle search input on mobile */}
        <button
          aria-label="Buscar"
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setShowSearchMobile(!showSearchMobile)}
        >
          <Search className="w-6 h-6 text-gray-600" />
        </button>

        {/* Notificações */}
        <button
          aria-label="Notificações"
          className="relative p-2 rounded hover:bg-gray-100"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Configurações */}
        <button
          aria-label="Configurações"
          className="p-2 rounded hover:bg-gray-100"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Search Input Slide Down */}
      {showSearchMobile && (
        <div className="absolute top-full left-0 right-0 bg-white px-4 py-2 border-b border-t md:hidden shadow">
          <input
            type="search"
            placeholder="Buscar projeto"
            className="w-full border rounded px-3 py-1 text-gray-600 focus:outline-indigo-500"
            autoFocus
            onBlur={() => setShowSearchMobile(false)}
          />
        </div>
      )}
    </header>
  );
}
