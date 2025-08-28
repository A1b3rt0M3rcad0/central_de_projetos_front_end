import React from "react";
import { Search, User, Mail, Building } from "lucide-react";

const SuggestionsDropdown = ({ 
  suggestions, 
  visible, 
  onSelect, 
  type = "names",
  placeholder = "Digite para buscar..." 
}) => {
  if (!visible || !suggestions || suggestions.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "names":
        return <User className="w-4 h-4 text-gray-400" />;
      case "emails":
        return <Mail className="w-4 h-4 text-gray-400" />;
      case "departments":
        return <Building className="w-4 h-4 text-gray-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case "names":
        return "Nomes sugeridos";
      case "emails":
        return "Emails sugeridos";
      case "departments":
        return "Departamentos sugeridos";
      default:
        return "Sugestões";
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {getIcon(type)}
          {getLabel(type)}
        </div>
      </div>
      
      <div className="py-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              {getIcon(type)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {suggestion.name || suggestion.email || suggestion.department}
              </div>
              {suggestion.description && (
                <div className="text-sm text-gray-500">
                  {suggestion.description}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {suggestions.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default SuggestionsDropdown; 