# DataTable - Componente de Lista Reutilizável

O `DataTable` é um componente altamente configurável e reutilizável para exibir listas de dados com funcionalidades avançadas de UI/UX.

## 🚀 Características

- ✅ **Busca Inteligente** - Filtro por texto em todas as colunas
- ✅ **Ordenação** - Clique nas colunas para ordenar
- ✅ **Paginação** - Navegação entre páginas com seleção de itens por página
- ✅ **Ações em Lote** - Seleção múltipla com ações customizadas
- ✅ **Ações por Linha** - Botões de ação individuais (editar, excluir, visualizar)
- ✅ **Ações Customizadas** - Botões adicionais configuráveis
- ✅ **Responsivo** - Adaptação perfeita para mobile e desktop
- ✅ **Tipos de Dados** - Suporte para diferentes formatos (data, moeda, status, etc.)
- ✅ **Loading States** - Indicadores de carregamento
- ✅ **Empty States** - Estados vazios personalizáveis

## 📋 Uso Básico

```jsx
import DataTable from "../../components/ui/DataTable";

function MinhaLista() {
  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Nome", sortable: true },
    { key: "email", label: "Email", sortable: true },
  ];

  const config = {
    title: "Minha Lista",
    createButtonText: "Criar Novo",
  };

  return (
    <DataTable
      data={meusDados}
      columns={columns}
      config={config}
      onCreate={() => console.log("Criar")}
      onEdit={(item) => console.log("Editar", item)}
      onDelete={(item) => console.log("Excluir", item)}
    />
  );
}
```

## 🔧 Configuração de Colunas

### Propriedades da Coluna

```jsx
const columns = [
  {
    key: "id", // Chave do campo no objeto de dados
    label: "ID", // Label exibido no cabeçalho
    sortable: true, // Se a coluna pode ser ordenada
    type: "number", // Tipo de dados (number, date, currency, status, truncate)
    accessor: (item) => item.id, // Função para acessar o valor
    render: (value, item) => {}, // Função customizada para renderizar
    statusColors: {}, // Cores para tipo "status"
  },
];
```

### Tipos de Coluna

#### 1. **Texto Padrão**

```jsx
{ key: "name", label: "Nome", sortable: true }
```

#### 2. **Data**

```jsx
{ key: "created_at", label: "Criado em", type: "date", sortable: true }
```

#### 3. **Moeda**

```jsx
{ key: "price", label: "Preço", type: "currency", sortable: true }
```

#### 4. **Status com Cores**

```jsx
{
  key: "status",
  label: "Status",
  type: "status",
  sortable: true,
  statusColors: {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  }
}
```

#### 5. **Texto Truncado**

```jsx
{ key: "description", label: "Descrição", type: "truncate", sortable: true }
```

#### 6. **Renderização Customizada**

```jsx
{
  key: "email",
  label: "Email",
  render: (value) => (
    <div className="flex items-center gap-2">
      <Mail className="w-4 h-4" />
      <span>{value}</span>
    </div>
  )
}
```

## ⚙️ Configurações da Tabela

```jsx
const config = {
  title: "Título da Lista", // Título exibido no header
  createButtonText: "Criar Novo", // Texto do botão criar
  searchPlaceholder: "Buscar...", // Placeholder do campo de busca
  emptyMessage: "Nenhum dado encontrado.", // Mensagem quando vazio
  showSearch: true, // Mostrar campo de busca
  showFilters: true, // Mostrar botão de filtros
  showPagination: true, // Mostrar paginação
  showBulkActions: false, // Mostrar ações em lote
  showRefresh: true, // Mostrar botão de atualizar
  showExport: false, // Mostrar botão de exportar
  loading: false, // Estado de carregamento
};
```

## 🎯 Ações Customizadas

### Ações por Linha

```jsx
const actions = {
  row: [
    {
      label: "Enviar Email",
      icon: <Mail className="w-4 h-4" />,
      className: "text-purple-600 hover:bg-purple-50",
      onClick: (item) => console.log("Email para:", item.email),
    },
    {
      label: "Duplicar",
      icon: <Copy className="w-4 h-4" />,
      onClick: (item) => console.log("Duplicar:", item),
    },
  ],
};
```

### Ações em Lote

```jsx
const actions = {
  bulk: [
    {
      label: "Ativar Selecionados",
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (selectedItems) => console.log("Ativar:", selectedItems),
    },
    {
      label: "Excluir Selecionados",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (selectedItems) => console.log("Excluir:", selectedItems),
    },
  ],
};
```

## 📱 Exemplo Completo

```jsx
import DataTable from "../../components/ui/DataTable";
import { Mail, UserCheck, Download } from "lucide-react";

function UserList() {
  const formatCPF = (cpf) => {
    const numbersOnly = cpf.replace(/\D/g, "");
    if (numbersOnly.length !== 11) return cpf;
    return numbersOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const columns = [
    {
      key: "cpf",
      label: "CPF",
      sortable: true,
      render: (value) => formatCPF(value),
    },
    {
      key: "name",
      label: "Nome",
      sortable: true,
      type: "truncate",
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate max-w-[200px]" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Cargo",
      sortable: true,
      type: "status",
      statusColors: {
        admin: "bg-red-100 text-red-800",
        user: "bg-blue-100 text-blue-800",
        fiscal: "bg-green-100 text-green-800",
      },
    },
    {
      key: "created_at",
      label: "Criado em",
      sortable: true,
      type: "date",
    },
  ];

  const config = {
    title: "Usuários",
    createButtonText: "Criar Usuário",
    searchPlaceholder: "Buscar por nome, email ou CPF...",
    emptyMessage: "Nenhum usuário encontrado.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
    showBulkActions: true,
  };

  const actions = {
    bulk: [
      {
        label: "Ativar Usuários",
        icon: <UserCheck className="w-4 h-4" />,
        onClick: (selectedItems) => {
          console.log("Ativar usuários:", selectedItems);
        },
      },
    ],
    row: [
      {
        label: "Enviar Email",
        icon: <Mail className="w-4 h-4" />,
        className: "text-purple-600 hover:bg-purple-50",
        onClick: (user) => {
          console.log("Enviar email para:", user.email);
        },
      },
    ],
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      config={config}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      actions={actions}
    />
  );
}
```

## 🎨 Personalização de Estilos

O componente usa Tailwind CSS e pode ser personalizado através das classes CSS. Os principais elementos são:

- **Header**: `bg-gray-50 border-b border-gray-200`
- **Linhas**: `hover:bg-gray-50 transition-colors`
- **Botões de ação**: Cores específicas para cada ação (azul, verde, vermelho, roxo)
- **Paginação**: `bg-gray-50 border-t border-gray-200`

## 🔄 Estados da Tabela

### Loading

```jsx
const config = {
  loading: true, // Mostra spinner no header
};
```

### Empty State

```jsx
const config = {
  emptyMessage: "Nenhum resultado encontrado para sua busca.",
};
```

### Error State

```jsx
// Implementar tratamento de erro no componente pai
const [error, setError] = useState(null);

if (error) {
  return <div className="text-red-600">Erro ao carregar dados: {error}</div>;
}
```

## 📊 Performance

- **Memoização**: Dados filtrados e ordenados são memoizados
- **Paginação**: Renderiza apenas os itens da página atual
- **Lazy Loading**: Suporte para carregamento sob demanda
- **Debounce**: Busca otimizada (pode ser implementada)

## 🎯 Boas Práticas

1. **Defina tipos de coluna apropriados** para melhor formatação
2. **Use renderização customizada** para dados complexos
3. **Implemente ações em lote** para operações comuns
4. **Configure cores de status** para melhor visualização
5. **Use truncate** para textos longos
6. **Implemente loading states** para melhor UX
7. **Configure mensagens vazias** informativas
