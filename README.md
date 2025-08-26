# Escritório de Projetos - Frontend

Sistema de gerenciamento de projetos para escritório governamental desenvolvido em React.

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **SweetAlert2** - Notificações

## 📁 Estrutura do Projeto

```
src/
├── config/                 # Configurações centralizadas
│   ├── constants.js       # Constantes da aplicação
│   └── api.js            # Configuração da API
├── components/            # Componentes reutilizáveis
│   ├── layout/           # Componentes de layout
│   │   └── BasePage.jsx
│   ├── auth/             # Componentes de autenticação
│   │   └── AuthGuard.jsx
│   ├── ui/               # Componentes de interface
│   │   └── LoadingSpinner.jsx
│   ├── SideBar.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── BaseContent.jsx
├── pages/                # Páginas da aplicação
│   ├── auth/            # Páginas de autenticação
│   │   └── Login.jsx
│   ├── dashboard/       # Páginas do dashboard
│   │   └── HomePage.jsx
│   ├── projects/        # Páginas de projetos
│   │   ├── ProjectListPage.jsx
│   │   ├── ProjectFormPage.jsx
│   │   └── ProjectViewPage.jsx
│   ├── empresas/        # Páginas de empresas
│   │   ├── EmpresaListPage.jsx
│   │   └── EmpresaFormPage.jsx
│   ├── fiscais/         # Páginas de fiscais
│   │   ├── FiscalListPage.jsx
│   │   └── FiscalFormPage.jsx
│   ├── bairros/         # Páginas de bairros
│   │   ├── BairroListPage.jsx
│   │   └── BairroFormPage.jsx
│   ├── usuarios/        # Páginas de usuários
│   │   ├── UserListPage.jsx
│   │   └── UserFormPage.jsx
│   ├── status/          # Páginas de status
│   │   ├── StatusListPage.jsx
│   │   └── StatusFormPage.jsx
│   ├── tipos/           # Páginas de tipos
│   │   ├── TipoListPage.jsx
│   │   └── TipoFormPage.jsx
│   ├── documents/       # Páginas de documentos
│   │   └── DocumentFormPage.jsx
│   └── associations/    # Páginas de associações
│       └── ProjectAssociationFormPage.jsx
├── features/            # Funcionalidades da aplicação
│   ├── contents/        # Conteúdos das páginas
│   │   ├── HomeContent.jsx
│   │   ├── ProjectListContent.jsx
│   │   ├── ProjectContent.jsx
│   │   ├── UserListContent.jsx
│   │   ├── StatusListContent.jsx
│   │   ├── TipoListContent.jsx
│   │   ├── BairroListContent.jsx
│   │   ├── FiscalListContent.jsx
│   │   ├── EmpresaListContent.jsx
│   │   └── LoadingContent.jsx
│   └── forms/           # Formulários
│       ├── ProjectForm.jsx
│       ├── ProjectAssociationForm.jsx
│       ├── DocumentForm.jsx
│       ├── UserForm.jsx
│       ├── StatusForm.jsx
│       ├── TipoForm.jsx
│       ├── BairroForm.jsx
│       ├── FiscalForm.jsx
│       └── EmpresaForm.jsx
├── services/            # Serviços e APIs
│   ├── api/            # Endpoints da API
│   │   ├── auth.jsx
│   │   ├── user.jsx
│   │   ├── project.jsx
│   │   ├── empresa.jsx
│   │   ├── fiscal.jsx
│   │   ├── bairro.jsx
│   │   ├── status.jsx
│   │   ├── tipo.jsx
│   │   └── documents.jsx
│   └── index.js        # Exportações dos serviços
├── hooks/              # Hooks personalizados
│   └── useAuth.js      # Hook de autenticação
├── routes/             # Configuração de rotas
│   └── index.jsx       # Definição das rotas
├── utils/              # Utilitários
├── assets/             # Recursos estáticos
├── main.jsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🛠️ Instalação e Execução

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**

   ```bash
   npm run dev
   ```

3. **Build para produção:**

   ```bash
   npm run build
   ```

4. **Preview da build:**
   ```bash
   npm run preview
   ```

## 🔐 Autenticação

O sistema utiliza autenticação baseada em JWT com as seguintes funcionalidades:

- **Login:** Autenticação com CPF e senha
- **AuthGuard:** Proteção de rotas
- **useAuth:** Hook personalizado para gerenciar estado de autenticação
- **Interceptors:** Configuração automática de tokens nas requisições

## 📊 Funcionalidades

### Dashboard

- Visão geral dos projetos
- Gráficos de distribuição por bairro
- Estatísticas de orçamento
- Tabelas de projetos por fiscal/empresa

### Projetos

- Listagem com filtros
- Criação e edição
- Visualização detalhada
- Upload de documentos
- Associações (usuários, bairros, empresas, fiscais)

### Gestão de Dados

- **Empresas:** CRUD completo
- **Fiscais:** CRUD completo
- **Bairros:** CRUD completo
- **Usuários:** CRUD completo
- **Status:** CRUD completo
- **Tipos:** CRUD completo

## 🔧 Configuração

### API

A configuração da API está centralizada em `src/config/api.js`:

```javascript
const API_CONFIG = {
  BASE_URL: "http://localhost:8000",
  TIMEOUT: 1000000,
};
```

### Rotas

As rotas estão definidas em `src/config/constants.js` e organizadas por domínio.

## 📝 Convenções

### Nomenclatura

- **Componentes:** PascalCase (ex: `BasePage.jsx`)
- **Arquivos:** PascalCase para componentes, camelCase para utilitários
- **Pastas:** camelCase para features, PascalCase para páginas

### Estrutura de Imports

- Usar imports relativos para arquivos próximos
- Usar imports absolutos para configurações globais
- Centralizar exports em arquivos `index.js`

### Organização

- **Separação por domínio:** Cada entidade tem sua pasta
- **Separação de responsabilidades:** Páginas, conteúdos e formulários separados
- **Reutilização:** Componentes genéricos em `components/`

## 🚀 Melhorias Implementadas

1. **Estrutura Organizada:** Separação clara por domínio e responsabilidade
2. **Configuração Centralizada:** Constantes e configurações em arquivos dedicados
3. **Hooks Personalizados:** `useAuth` para gerenciar autenticação
4. **Proteção de Rotas:** `AuthGuard` unificado
5. **Imports Limpos:** Arquivos de índice para facilitar imports
6. **Nomenclatura Consistente:** Padrões claros de nomenclatura
7. **Separação de Features:** Conteúdos e formulários organizados
8. **Configuração de API:** Interceptors e configuração centralizada

## 🔄 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar TypeScript
- [ ] Implementar cache de dados
- [ ] Adicionar validação de formulários
- [ ] Implementar sistema de notificações
- [ ] Adicionar temas (dark/light mode)
- [ ] Implementar lazy loading
- [ ] Adicionar PWA capabilities
