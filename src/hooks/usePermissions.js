import { useMemo } from "react";

/**
 * Hook para gerenciar permissões baseadas no role do usuário
 *
 * Hierarquia de permissões:
 * - ADMIN: Acesso total ao sistema
 * - VEREADOR: Acesso intermediário - pode gerenciar seus projetos
 * - ASSESSOR: Acesso limitado - apenas visualização
 */
export const usePermissions = (userRole) => {
  const role = userRole?.toUpperCase();

  const permissions = useMemo(() => {
    // Permissões baseadas na análise do backend
    const basePermissions = {
      // ==================== VISUALIZAÇÃO ====================
      // Todos podem visualizar (ADMIN, VEREADOR, ASSESSOR)
      canView: true,
      canViewProjects: true,
      canViewDashboard: true,
      canViewReports: true,
      canViewFiscais: true,
      canViewEmpresas: true,
      canViewBairros: true,
      canViewStatus: true,
      canViewTipos: true,
      canViewDocuments: true, // Todos podem ver documentos
      canViewFiscalizacoes: true,
      canViewAssociations: role === "ADMIN", // Apenas ADMIN vê associações detalhadas

      // Visualização de usuários - apenas ADMIN (baseado no backend)
      canViewUsers: role === "ADMIN",
      canViewUserDetails: role === "ADMIN",

      // ==================== PROJETOS ====================
      // Apenas ADMIN pode criar/editar/deletar projetos
      canCreateProject: role === "ADMIN",
      canEditProject: role === "ADMIN",
      canDeleteProject: role === "ADMIN",
      canUpdateProjectStatus: role === "ADMIN",
      canUpdateProjectDates: role === "ADMIN",
      canUpdateProjectVerba: role === "ADMIN",
      canAssociateVereador: role === "ADMIN",
      canBulkActions: role === "ADMIN",

      // ==================== FISCALIZAÇÕES (WORK PROJECTS) ====================
      // ADMIN tem controle total, VEREADOR acesso limitado
      canCreateFiscalizacao: role === "ADMIN", // Backend mostra ADMIN apenas
      canEditFiscalizacao: role === "ADMIN",
      canDeleteFiscalizacao: role === "ADMIN",
      canUploadFiscalizacaoDocuments: role === "ADMIN",
      canViewFiscalizacaoDocuments: true, // Todos podem ver

      // ==================== DOCUMENTOS ====================
      // Upload/Delete apenas ADMIN, visualização para todos
      canUploadDocuments: role === "ADMIN",
      canDeleteDocuments: role === "ADMIN",
      canDownloadDocuments: true,

      // ==================== USUÁRIOS ====================
      // Gerenciamento apenas ADMIN
      canCreateUser: role === "ADMIN",
      canEditUser: role === "ADMIN",
      canDeleteUser: role === "ADMIN",
      canUpdateUserPassword: role === "ADMIN",
      canUpdateUserEmail: role === "ADMIN",
      // Todos podem editar dados pessoais próprios
      canEditOwnProfile: true,

      // ==================== FISCAIS ====================
      // Apenas ADMIN pode criar/editar/deletar
      canCreateFiscal: role === "ADMIN",
      canEditFiscal: role === "ADMIN",
      canDeleteFiscal: role === "ADMIN",
      canUpdateFiscalEmail: role === "ADMIN",
      canUpdateFiscalPassword: role === "ADMIN",
      canUpdateFiscalPhone: role === "ADMIN",

      // ==================== EMPRESAS ====================
      // Apenas ADMIN pode criar/editar/deletar
      canCreateEmpresa: role === "ADMIN",
      canEditEmpresa: role === "ADMIN",
      canDeleteEmpresa: role === "ADMIN",

      // ==================== BAIRROS ====================
      // Apenas ADMIN pode criar/editar/deletar
      canCreateBairro: role === "ADMIN",
      canEditBairro: role === "ADMIN",
      canDeleteBairro: role === "ADMIN",

      // ==================== STATUS ====================
      // Apenas ADMIN pode criar/editar/deletar
      canCreateStatus: role === "ADMIN",
      canEditStatus: role === "ADMIN",
      canDeleteStatus: role === "ADMIN",

      // ==================== TIPOS ====================
      // Apenas ADMIN pode criar/editar/deletar
      canCreateTipo: role === "ADMIN",
      canEditTipo: role === "ADMIN",
      canDeleteTipo: role === "ADMIN",

      // ==================== ASSOCIAÇÕES ====================
      // Apenas ADMIN pode criar/deletar associações
      canCreateAssociation: role === "ADMIN",
      canDeleteAssociation: role === "ADMIN",

      // ==================== NOTIFICAÇÕES ====================
      // Apenas ADMIN e VEREADOR têm acesso a notificações (ASSESSOR não precisa)
      canViewNotifications: ["ADMIN", "VEREADOR"].includes(role),
      canMarkNotificationAsRead: ["ADMIN", "VEREADOR"].includes(role),
      canDeleteNotification: ["ADMIN", "VEREADOR"].includes(role),
      // Apenas ADMIN pode criar notificações
      canCreateNotification: role === "ADMIN",

      // ==================== EXPORTAÇÃO E RELATÓRIOS ====================
      canExportData: true, // Todos podem exportar
      canGenerateReports: true,

      // ==================== DASHBOARD ====================
      canViewDashboardStats: true,
      canViewBairroStats: role === "ADMIN", // Alguns módulos requerem ADMIN
      canViewStatusStats: role === "ADMIN",

      // ==================== CONFIGURAÇÕES ====================
      canAccessSettings: role === "ADMIN",
      canManageSystemConfig: role === "ADMIN",

      // ==================== HELPERS ====================
      isAdmin: role === "ADMIN",
      isVereador: role === "VEREADOR",
      isAssessor: role === "ASSESSOR",
    };

    return basePermissions;
  }, [role]);

  /**
   * Verifica se o usuário tem permissão para executar uma ação
   * @param {string} permission - Nome da permissão a verificar
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return permissions[permission] ?? false;
  };

  /**
   * Verifica se o usuário tem qualquer uma das permissões fornecidas
   * @param {string[]} permissionList - Array de permissões
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionList) => {
    return permissionList.some((permission) => hasPermission(permission));
  };

  /**
   * Verifica se o usuário tem todas as permissões fornecidas
   * @param {string[]} permissionList - Array de permissões
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionList) => {
    return permissionList.every((permission) => hasPermission(permission));
  };

  return {
    ...permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    role,
  };
};

/**
 * Obter role do usuário do localStorage
 * @returns {string|null}
 */
export const getUserRole = () => {
  try {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.role?.toUpperCase();
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter role do usuário:", error);
    return null;
  }
};

/**
 * Descrições dos roles para exibição
 */
export const ROLE_DESCRIPTIONS = {
  ADMIN: {
    label: "Administrador",
    description: "Acesso completo ao sistema",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  VEREADOR: {
    label: "Vereador",
    description: "Gestão de projetos e fiscalizações",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  ASSESSOR: {
    label: "Assessor",
    description: "Acesso de visualização",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
};
