import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User,
  MoreHorizontal,
} from "lucide-react";

const TYPE_CONFIG = {
  fase: {
    icon: "📋",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  entrega: {
    icon: "📦",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    iconBg: "bg-green-100",
  },
  atividade: {
    icon: "✅",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    iconBg: "bg-purple-100",
  },
};

const STATUS_CONFIG = {
  nao_iniciado: {
    label: "Não Iniciado",
    color: "bg-gray-100 text-gray-700",
  },
  em_andamento: {
    label: "Em Andamento",
    color: "bg-blue-100 text-blue-700",
  },
  concluido: {
    label: "Concluído",
    color: "bg-green-100 text-green-700",
  },
  pausado: {
    label: "Pausado",
    color: "bg-yellow-100 text-yellow-700",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700",
  },
};

export default function EAPNode({
  item,
  level = 0,
  isExpanded,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
  expandedItems,
  isLast = false,
}) {
  const [showActions, setShowActions] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.atividade;
  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.nao_iniciado;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="relative">
      {/* Linhas de conexão visual */}
      {level > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
      )}

      <div
        className="group relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Nó principal */}
        <div
          className={`
            flex items-center gap-3 p-3 rounded-lg border-l-4
            ${config.bgColor} ${config.borderColor}
            hover:shadow-md transition-all cursor-pointer
          `}
          style={{ marginLeft: `${level * 32}px` }}
        >
          {/* Botão de expandir/colapsar */}
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button
                onClick={() => onToggleExpand(item.id)}
                className="p-1 hover:bg-white/50 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            {/* Ícone do tipo */}
            <div
              className={`w-8 h-8 ${config.iconBg} rounded-lg flex items-center justify-center text-lg`}
            >
              {config.icon}
            </div>
          </div>

          {/* Código WBS */}
          <div className="font-mono text-sm font-semibold text-gray-600 min-w-[60px]">
            {item.code}
          </div>

          {/* Nome e Descrição */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {item.name}
            </div>
            {item.description && (
              <div className="text-sm text-gray-600 truncate mt-0.5">
                {item.description}
              </div>
            )}
          </div>

          {/* Badge de Status */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
          >
            {statusConfig.label}
          </div>

          {/* Barra de progresso */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  item.status === "concluido"
                    ? "bg-green-500"
                    : item.status === "em_andamento"
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 w-10 text-right">
              {item.progress}%
            </span>
          </div>

          {/* Informações extras */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* Responsável */}
            {item.responsible && (
              <div className="flex items-center gap-1" title="Responsável">
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">
                  {item.responsible}
                </span>
              </div>
            )}

            {/* Datas */}
            <div className="flex items-center gap-1" title="Período">
              <Calendar className="w-4 h-4" />
              <span className="whitespace-nowrap">
                {formatDate(item.start_date)} - {formatDate(item.end_date)}
              </span>
            </div>

            {/* Orçamento */}
            {item.budget > 0 && (
              <div className="flex items-center gap-1" title="Orçamento">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">
                  {formatCurrency(item.budget)}
                </span>
              </div>
            )}
          </div>

          {/* Ações (aparecem no hover) */}
          <div
            className={`
            flex items-center gap-1 transition-opacity
            ${showActions ? "opacity-100" : "opacity-0"}
          `}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(item);
              }}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Adicionar sub-item"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Renderizar filhos recursivamente */}
        {isExpanded && hasChildren && (
          <div className="mt-1">
            {item.children.map((child, index) => (
              <EAPNode
                key={child.id}
                item={child}
                level={level + 1}
                isExpanded={expandedItems.includes(child.id)}
                onToggleExpand={onToggleExpand}
                onAddChild={onAddChild}
                onEdit={onEdit}
                onDelete={onDelete}
                expandedItems={expandedItems}
                isLast={index === item.children.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
