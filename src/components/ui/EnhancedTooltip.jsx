import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Info, 
  ChevronRight, 
  MapPin, 
  Building, 
  User, 
  Users, 
  Flag, 
  Calendar, 
  DollarSign, 
  FileText,
  Clock,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Target
} from "lucide-react";

const EnhancedTooltip = ({
  children,
  content,
  items = [],
  maxItems = 3,
  position = "top",
  showIcon = false,
  className = "",
  type = "default", // default, info, warning, success, error
  size = "medium", // small, medium, large
  delay = 300, // delay before showing tooltip
  interactive = false, // allow tooltip to be interactive
  richContent = null, // for complex content like project details
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showDelay, setShowDelay] = useState(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Icon mapping for different types
  const getTypeIcon = (type) => {
    switch (type) {
      case "info": return <Info className="w-4 h-4 text-blue-400" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "location": return <MapPin className="w-4 h-4 text-purple-400" />;
      case "company": return <Building className="w-4 h-4 text-indigo-400" />;
      case "user": return <User className="w-4 h-4 text-cyan-400" />;
      case "users": return <Users className="w-4 h-4 text-pink-400" />;
      case "type": return <Flag className="w-4 h-4 text-orange-400" />;
      case "calendar": return <Calendar className="w-4 h-4 text-blue-400" />;
      case "budget": return <DollarSign className="w-4 h-4 text-green-400" />;
      case "document": return <FileText className="w-4 h-4 text-amber-400" />;
      case "history": return <Clock className="w-4 h-4 text-purple-400" />;
      case "progress": return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "view": return <Eye className="w-4 h-4 text-teal-400" />;
      case "status": return <Target className="w-4 h-4 text-gray-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "small": return "max-w-xs text-xs";
      case "large": return "max-w-md text-base";
      default: return "max-w-sm text-sm";
    }
  };

  // Type classes
  const getTypeClasses = () => {
    switch (type) {
      case "info": return "border-blue-500/20 bg-blue-950/90";
      case "warning": return "border-yellow-500/20 bg-yellow-950/90";
      case "success": return "border-green-500/20 bg-green-950/90";
      case "error": return "border-red-500/20 bg-red-950/90";
      default: return "border-gray-500/20 bg-gray-950/90";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        hideTooltip();
      }
    };

    if (interactive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [interactive]);

  const showTooltip = useCallback(() => {
    if (showDelay) {
      clearTimeout(showDelay);
    }
    
    const delayTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setShowDelay(delayTimer);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (showDelay) {
      clearTimeout(showDelay);
      setShowDelay(null);
    }
    setIsVisible(false);
    setShowAll(false);
  }, [showDelay]);

  const handleMouseEnter = () => {
    if (items.length > 1 || content || richContent) {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (!interactive) {
      hideTooltip();
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (items.length > maxItems) {
      setShowAll(!showAll);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-3";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-3";
      case "right":
        return "left-full top-1/2 transform translate-x-3";
      default: // top
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-3";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "bottom":
        return "absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800";
      case "left":
        return "absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800";
      case "right":
        return "absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800";
      default: // top
        return "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800";
    }
  };

  const renderRichContent = () => {
    if (!richContent) return null;

    return (
      <div className="space-y-3">
        {/* Header */}
        {richContent.title && (
          <div className="flex items-center gap-2 pb-2 border-b border-gray-700/50">
            {richContent.icon && (
              <span className="text-lg">{richContent.icon}</span>
            )}
            <span className="font-semibold text-gray-100 text-sm">
              {richContent.title}
            </span>
          </div>
        )}

        {/* Content sections */}
        {richContent.sections?.map((section, index) => (
          <div key={index} className="space-y-2">
            {section.label && (
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {section.label}
              </div>
            )}
            
            {section.items && (
              <div className="space-y-1.5">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2 text-xs text-gray-200">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
            
            {section.content && (
              <div className="text-xs text-gray-300 leading-relaxed">
                {section.content}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        {richContent.footer && (
          <div className="pt-2 border-t border-gray-700/50 text-xs text-gray-400">
            {richContent.footer}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (richContent) {
      return renderRichContent();
    }

    if (content) {
      return (
        <div className="text-sm text-gray-200 leading-relaxed">{content}</div>
      );
    }

    if (items.length === 0) return null;

    const displayItems = showAll ? items : items.slice(0, maxItems);
    const hasMore = items.length > maxItems;

    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-300 uppercase tracking-wide mb-2">
          {items.length === 1 ? "Item" : `${items.length} Itens`}
        </div>

        <div className="space-y-1.5">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-200"
            >
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={handleClick}
            className="w-full mt-3 pt-2 border-t border-gray-600 flex items-center justify-center gap-2 text-xs text-blue-300 hover:text-blue-200 transition-colors"
          >
            <span>
              {showAll
                ? "Mostrar menos"
                : `Ver mais ${items.length - maxItems} itens`}
            </span>
            <ChevronRight
              className={`w-3 h-3 transition-transform ${
                showAll ? "rotate-90" : ""
              }`}
            />
          </button>
        )}
      </div>
    );
  };

  // Se não há conteúdo para mostrar, retorna apenas os children
  if ((!content && items.length <= 1 && !richContent) || (!content && items.length === 0 && !richContent)) {
    return <span className={className}>{children}</span>;
  }

  return (
    <div className="relative inline-block">
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`cursor-help transition-all duration-200 hover:opacity-80 ${className}`}
      >
        {children}
        {showIcon && (
          <span className="inline-block ml-1 text-gray-400 hover:text-gray-600 transition-colors">
            {getTypeIcon(type)}
          </span>
        )}
      </span>

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${getPositionClasses()}`}
          onMouseEnter={() => interactive && setIsVisible(true)}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          <div className={`${getSizeClasses()} ${getTypeClasses()} text-white px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm`}>
            {renderContent()}
            <div className={getArrowClasses()}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTooltip;
