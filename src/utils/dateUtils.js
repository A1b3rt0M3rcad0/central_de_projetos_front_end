/**
 * Utilitários para formatação de datas
 */

/**
 * Formata uma data de forma robusta, lidando com diferentes formatos
 * @param {string|Date} dateString - A data a ser formatada
 * @param {string} locale - O locale para formatação (padrão: 'pt-BR')
 * @param {string} fallback - Valor de fallback se a data for inválida (padrão: '--')
 * @returns {string} Data formatada ou valor de fallback
 */
export const formatDate = (dateString, locale = "pt-BR", fallback = "--") => {
  if (!dateString) return fallback;

  try {
    // Se já é um objeto Date
    if (dateString instanceof Date) {
      if (isNaN(dateString.getTime())) return fallback;
      return dateString.toLocaleDateString(locale);
    }

    // Se é uma string
    if (typeof dateString === "string") {
      // Verifica se é formato brasileiro (dd/mm/yyyy)
      if (dateString.includes("/")) {
        const parts = dateString.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const date = new Date(year, month - 1, day);
          if (isNaN(date.getTime())) return fallback;
          return date.toLocaleDateString(locale);
        }
      }

      // Tenta criar uma nova data
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return fallback;
      return date.toLocaleDateString(locale);
    }

    return fallback;
  } catch (error) {
    console.warn("Erro ao formatar data:", dateString, error);
    return fallback;
  }
};

/**
 * Formata uma data e hora
 * @param {string|Date} dateString - A data a ser formatada
 * @param {string} locale - O locale para formatação (padrão: 'pt-BR')
 * @param {string} fallback - Valor de fallback se a data for inválida (padrão: '--')
 * @returns {string} Data e hora formatada ou valor de fallback
 */
export const formatDateTime = (
  dateString,
  locale = "pt-BR",
  fallback = "--"
) => {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;

    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn("Erro ao formatar data/hora:", dateString, error);
    return fallback;
  }
};

/**
 * Verifica se uma data é válida
 * @param {string|Date} dateString - A data a ser verificada
 * @returns {boolean} True se a data for válida
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Obtém a data relativa (ex: "há 2 dias")
 * @param {string|Date} dateString - A data de referência
 * @param {string} locale - O locale para formatação (padrão: 'pt-BR')
 * @param {string} fallback - Valor de fallback se a data for inválida (padrão: '--')
 * @returns {string} Data relativa ou valor de fallback
 */
export const getRelativeDate = (
  dateString,
  locale = "pt-BR",
  fallback = "--"
) => {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;

    return `Há ${Math.floor(diffDays / 365)} anos`;
  } catch (error) {
    console.warn("Erro ao calcular data relativa:", dateString, error);
    return fallback;
  }
};
