# Componentes da HomePage

Este diretório contém os componentes reutilizáveis criados para a página HomePage, transformando elementos complexos em componentes modulares e reutilizáveis.

## Componentes Criados

### 1. StatCard

**Arquivo:** `StatCard.jsx`

Componente para exibir cards de estatísticas com ícone, label e valor.

**Props:**

- `icon` (ReactNode): Ícone do card
- `label` (string): Texto descritivo
- `value` (number): Valor numérico a ser exibido

**Exemplo de uso:**

```jsx
<StatCard
  icon={<Hammer className="text-blue-600" />}
  label="Total de Projetos"
  value={totalProjects}
/>
```

### 2. ProjectsByBairroChart

**Arquivo:** `ProjectsByBairroChart.jsx`

Gráfico de barras para exibir o número de projetos por bairro.

**Props:**

- `data` (array): Array de objetos com `nome` e `quantidade`

**Exemplo de uso:**

```jsx
<ProjectsByBairroChart data={countProjectsByBairroSorted} />
```

### 3. BudgetByBairroChart

**Arquivo:** `BudgetByBairroChart.jsx`

Gráfico de barras horizontais para exibir orçamento por bairro.

**Props:**

- `data` (array): Array de objetos com `nome` e `orcamento`

**Exemplo de uso:**

```jsx
<BudgetByBairroChart data={orcamentoProjectByBairroSorted} />
```

### 4. StatusDistributionChart

**Arquivo:** `StatusDistributionChart.jsx`

Gráfico de pizza para exibir distribuição de projetos por status.

**Props:**

- `data` (array): Array de objetos com `name` e `value`
- `filterValue` (string): Valor atual do filtro
- `onFilterChange` (function): Função para mudar o filtro
- `filterOptions` (array): Opções do filtro

**Exemplo de uso:**

```jsx
<StatusDistributionChart
  data={filteredStatusDistribution}
  filterValue={statusFilterBairro}
  onFilterChange={setStatusFilterBairro}
  filterOptions={bairroOptions}
/>
```

### 5. ProjectsByTypeChart

**Arquivo:** `ProjectsByTypeChart.jsx`

Gráfico de barras para exibir projetos por tipo, com suporte a filtros.

**Props:**

- `data` (array): Dados filtrados para exibição
- `filterValue` (string): Valor atual do filtro
- `onFilterChange` (function): Função para mudar o filtro
- `filterOptions` (array): Opções do filtro
- `fullData` (array): Dados completos para renderização de barras empilhadas

**Exemplo de uso:**

```jsx
<ProjectsByTypeChart
  data={filteredProjetosPorTipo}
  filterValue={tipoFilterBairro}
  onFilterChange={setTipoFilterBairro}
  filterOptions={bairroOptions}
  fullData={projetosPorTipoTransformado}
/>
```

### 6. TopPerformersTable

**Arquivo:** `TopPerformersTable.jsx`

Tabela reutilizável para exibir top performers com ordenação automática.

**Props:**

- `title` (string): Título da tabela
- `data` (array): Array de objetos com os dados
- `columns` (array): Array de objetos definindo as colunas
- `limit` (number, opcional): Limite de itens a exibir (padrão: 3)

**Exemplo de uso:**

```jsx
<TopPerformersTable
  title="👷 Fiscais e Projetos Associados"
  data={countProjectByFiscal}
  columns={[
    { key: "nome", label: "Fiscal" },
    { key: "projetos", label: "Projetos" },
  ]}
/>
```

## Benefícios da Refatoração

1. **Reutilização**: Os componentes podem ser usados em outras partes da aplicação
2. **Manutenibilidade**: Mudanças em um componente se refletem em todos os lugares onde é usado
3. **Testabilidade**: Cada componente pode ser testado isoladamente
4. **Legibilidade**: O código da HomePage ficou mais limpo e fácil de entender
5. **Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica

## Estrutura de Dados Esperada

### Para StatCard

```javascript
{
  icon: <ReactNode>,
  label: "string",
  value: number
}
```

### Para Gráficos

```javascript
// ProjectsByBairroChart e BudgetByBairroChart
[
  { nome: "string", quantidade: number }, // ou orcamento
  // ...
]

// StatusDistributionChart
[
  { name: "string", value: number },
  // ...
]
```

### Para TopPerformersTable

```javascript
// columns
[
  { key: "string", label: "string" },
  // ...
]

// data
[
  { nome: "string", projetos: number },
  // ...
]
```
