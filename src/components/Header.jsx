import { useState } from "react";
import { Settings, Bell, Search, Menu } from "lucide-react";

export default function Header({ pageTitle }) {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Título da página */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
        </div>

        {/* Desktop Search + Icons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar projeto..."
              className="pl-10 pr-4 py-2.5 w-64 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                       transition-all duration-200 bg-gray-50/50 hover:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Notificações"
              className="relative p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <button
              aria-label="Configurações"
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            aria-label="Buscar"
            className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            onClick={() => setShowSearchMobile(!showSearchMobile)}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <button
            aria-label="Notificações"
            className="relative p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <button
            aria-label="Menu"
            className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Search Input Slide Down */}
      {showSearchMobile && (
        <div className="px-6 py-3 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar projeto..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                       transition-all duration-200 bg-gray-50/50"
              autoFocus
              onBlur={() => setShowSearchMobile(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
