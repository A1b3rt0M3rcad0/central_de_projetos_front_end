// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  TIMEOUT: 1000000,
};

// Rotas da aplicação
export const ROUTES = {
  LOGIN: "/",
  HOME: "/home",
  PROJECTS: {
    LIST: "/projectlistpage",
    CREATE: "/projectform",
    EDIT: "/projectform",
    VIEW: "/projectpage",
    HISTORY: "/projecthistory",
    WORK_PROJECTS: "/workprojects",
    WORK_PROJECT_VIEW: "/workproject",
  },
  EMPRESAS: {
    LIST: "/empresalistpage",
    CREATE: "/empresaform",
    EDIT: "/empresaform",
  },
  FISCAIS: {
    LIST: "/fiscallist",
    CREATE: "/fiscalform",
    EDIT: "/fiscalform",
  },
  BAIRROS: {
    LIST: "/bairrolist",
    CREATE: "/bairroform",
    EDIT: "/bairroform",
  },
  USUARIOS: {
    LIST: "/userlist",
    CREATE: "/userform",
    EDIT: "/userform",
  },
  STATUS: {
    LIST: "/statuslist",
    CREATE: "/statusform",
    EDIT: "/statusform",
  },
  TIPOS: {
    LIST: "/tipolist",
    CREATE: "/tipoform",
    EDIT: "/tipoform",
  },
  DOCUMENTS: {
    CREATE: "/documentform",
  },
  ASSOCIATIONS: {
    PROJECT: "/projectassociationform",
  },
};

// Configurações de autenticação
export const AUTH_CONFIG = {
  TOKEN_KEY: "access_token",
  USER_INFO_KEY: "user_info",
};

// Configurações de UI
export const UI_CONFIG = {
  CHART_COLORS: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  ITEMS_PER_PAGE: 10,
};
