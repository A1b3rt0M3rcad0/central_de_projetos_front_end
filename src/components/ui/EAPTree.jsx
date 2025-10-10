import EAPNode from "./EAPNode";

export default function EAPTree({
  items,
  expandedItems,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
  level = 0,
}) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <p className="text-gray-600">Nenhum item no EAP ainda.</p>
        <p className="text-sm text-gray-500 mt-1">
          Clique em "Nova Fase" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <EAPNode
          key={item.id}
          item={item}
          level={level}
          isExpanded={expandedItems.includes(item.id)}
          onToggleExpand={onToggleExpand}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
          expandedItems={expandedItems}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

