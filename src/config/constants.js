// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8002/api/v1",
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
    EAP: "/project/:id/eap",
  },
  EMPRESAS: {
    LIST: "/empresalistpage",
    CREATE: "/empresaform",
    EDIT: "/empresaform",
    VIEW: "/empresaview",
  },
  FISCAIS: {
    LIST: "/fiscallist",
    CREATE: "/fiscalform",
    EDIT: "/fiscalform",
    VIEW: "/fiscalview",
  },
  BAIRROS: {
    LIST: "/bairrolist",
    CREATE: "/bairroform",
    EDIT: "/bairroform",
    VIEW: "/bairroview",
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
    VIEW: "/statusview",
  },
  TIPOS: {
    LIST: "/tipolist",
    CREATE: "/tipoform",
    EDIT: "/tipoform",
    VIEW: "/tipoview",
  },
  DOCUMENTS: {
    CREATE: "/documentform",
  },
  ASSOCIATIONS: {
    PROJECT: "/projectassociationform",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
  },
  HELP: "/help",
  FISCAL: {
    LOGIN: "/fiscal/login",
    DASHBOARD: "/fiscal/dashboard",
    PROFILE: "/fiscal/profile",
    PROJECTS: "/fiscal/projects",
    WORK_PROJECTS: "/fiscal/work-projects",
    PROJECT_WORK_PROJECTS: "/fiscal/project/:projectId/work-projects",
    CREATE_WORK_PROJECT: "/fiscal/project/:projectId/create-work-project",
    WORK_PROJECT_VIEW: "/fiscal/work-project/:workProjectId",
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
