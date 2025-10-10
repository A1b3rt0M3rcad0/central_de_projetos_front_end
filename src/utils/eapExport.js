import * as XLSX from 'xlsx';

/**
 * Formata valor monetário para o padrão brasileiro
 */
const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata data para o padrão brasileiro
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Determina o status baseado no progresso
 */
const getStatus = (progress) => {
  if (progress >= 100) return '✅ Concluído';
  if (progress > 0) return '🔄 Em Progresso';
  return '⏳ Não Iniciado';
};

/**
 * Calcula o nível hierárquico do item baseado no código WBS
 */
const getItemLevel = (code) => {
  if (!code) return 0;
  return code.split('.').length;
};

/**
 * Cria indentação visual baseada no nível
 */
const getIndentation = (level) => {
  return '  '.repeat(Math.max(0, level - 1));
};

/**
 * Ordena itens hierarquicamente pelo código WBS
 */
const sortItemsByWBS = (items) => {
  return [...items].sort((a, b) => {
    const codeA = a.wbs_code || '';
    const codeB = b.wbs_code || '';
    
    // Divide os códigos em partes numéricas
    const partsA = codeA.split('.').map(Number);
    const partsB = codeB.split('.').map(Number);
    
    // Compara parte por parte
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;
      if (numA !== numB) return numA - numB;
    }
    
    return 0;
  });
};

/**
 * Gera aba de resumo do projeto
 */
const generateSummarySheet = (eapData, projectName, stats) => {
  const summaryData = [
    ['ESTRUTURA ANALÍTICA DO PROJETO (EAP)'],
    [],
    ['Informações Gerais'],
    ['Projeto:', projectName || 'Sem nome'],
    ['EAP:', eapData.name || 'Sem nome'],
    ['Descrição:', eapData.description || '-'],
    [],
    ['Estatísticas'],
    ['Total de Itens:', stats.totalItems || 0],
    ['Itens Concluídos:', stats.completedItems || 0],
    ['Progresso Geral:', `${stats.avgProgress || 0}%`],
    [],
    ['Estrutura'],
    ['Fases:', stats.fases || 0],
    ['Entregas:', stats.entregas || 0],
    ['Atividades:', stats.atividades || 0],
    [],
    ['Orçamento'],
    ['Orçamento Total da EAP:', formatCurrency(stats.totalBudget || 0)],
    ['Orçamento do Projeto:', formatCurrency(eapData.project_budget || 0)],
    [],
    ['Data de Exportação:', new Date().toLocaleString('pt-BR')],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Aplica estilos na aba de resumo
  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: '1976D2' } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  const sectionHeaderStyle = {
    font: { bold: true, sz: 12, color: { rgb: '424242' } },
    fill: { fgColor: { rgb: 'E3F2FD' } },
    alignment: { horizontal: 'left', vertical: 'center' },
  };

  const labelStyle = {
    font: { bold: true, sz: 10 },
    alignment: { horizontal: 'right', vertical: 'center' },
  };

  const valueStyle = {
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
  };

  // Título
  if (worksheet['A1']) worksheet['A1'].s = titleStyle;

  // Cabeçalhos de seção
  if (worksheet['A3']) worksheet['A3'].s = sectionHeaderStyle;
  if (worksheet['A8']) worksheet['A8'].s = sectionHeaderStyle;
  if (worksheet['A13']) worksheet['A13'].s = sectionHeaderStyle;
  if (worksheet['A18']) worksheet['A18'].s = sectionHeaderStyle;

  // Labels e valores
  ['A4', 'A5', 'A6', 'A9', 'A10', 'A11', 'A14', 'A15', 'A16', 'A19', 'A20', 'A22'].forEach(cell => {
    if (worksheet[cell]) worksheet[cell].s = labelStyle;
  });

  ['B4', 'B5', 'B6', 'B9', 'B10', 'B11', 'B14', 'B15', 'B16', 'B19', 'B20', 'B22'].forEach(cell => {
    if (worksheet[cell]) worksheet[cell].s = valueStyle;
  });

  // Largura das colunas
  worksheet['!cols'] = [
    { wch: 25 }, // Coluna A - Labels
    { wch: 50 }, // Coluna B - Valores
  ];

  // Mescla o título
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Mescla A1:B1
  ];

  return worksheet;
};

/**
 * Aplica estilo de célula
 */
const applyCellStyle = (worksheet, cell, style) => {
  if (!worksheet[cell]) return;
  worksheet[cell].s = style;
};

/**
 * Obtém cor de fundo baseada no tipo e nível do item
 */
const getItemBackgroundColor = (itemType, level) => {
  // Cores mais suaves e profissionais
  const colors = {
    FASE: { fgColor: { rgb: 'E3F2FD' } },        // Azul claro
    ENTREGA: { fgColor: { rgb: 'F1F8E9' } },     // Verde claro
    ATIVIDADE: { fgColor: { rgb: 'FFF9C4' } },   // Amarelo claro
    default: { fgColor: { rgb: 'FAFAFA' } },     // Cinza muito claro
  };

  return colors[itemType] || colors.default;
};

/**
 * Cria estilos para as células
 */
const createCellStyles = () => {
  return {
    header: {
      fill: { fgColor: { rgb: '1976D2' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    },
    fase: {
      font: { bold: true, sz: 11 },
      fill: { fgColor: { rgb: 'BBDEFB' } },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '90CAF9' } },
        bottom: { style: 'thin', color: { rgb: '90CAF9' } },
        left: { style: 'medium', color: { rgb: '1976D2' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } },
      },
    },
    entrega: {
      font: { bold: false, sz: 10 },
      fill: { fgColor: { rgb: 'E8F5E9' } },
      alignment: { horizontal: 'left', vertical: 'center', indent: 1 },
      border: {
        top: { style: 'thin', color: { rgb: 'C8E6C9' } },
        bottom: { style: 'thin', color: { rgb: 'C8E6C9' } },
        left: { style: 'medium', color: { rgb: '66BB6A' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } },
      },
    },
    atividade: {
      font: { sz: 10, color: { rgb: '424242' } },
      fill: { fgColor: { rgb: 'FFFDE7' } },
      alignment: { horizontal: 'left', vertical: 'center', indent: 2 },
      border: {
        top: { style: 'hair', color: { rgb: 'FFF59D' } },
        bottom: { style: 'hair', color: { rgb: 'FFF59D' } },
        left: { style: 'medium', color: { rgb: 'FDD835' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } },
      },
    },
    normal: {
      font: { sz: 10 },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
        top: { style: 'hair', color: { rgb: 'EEEEEE' } },
        bottom: { style: 'hair', color: { rgb: 'EEEEEE' } },
        left: { style: 'thin', color: { rgb: 'EEEEEE' } },
        right: { style: 'thin', color: { rgb: 'EEEEEE' } },
      },
    },
    currency: {
      font: { sz: 10 },
      alignment: { horizontal: 'right', vertical: 'center' },
      numFmt: 'R$ #,##0.00',
    },
    percent: {
      font: { sz: 10 },
      alignment: { horizontal: 'center', vertical: 'center' },
      numFmt: '0"%"',
    },
    date: {
      font: { sz: 10 },
      alignment: { horizontal: 'center', vertical: 'center' },
      numFmt: 'dd/mm/yyyy',
    },
  };
};

/**
 * Achata a estrutura hierárquica recursivamente
 */
const flattenHierarchy = (items, parentCode = '', level = 1) => {
  const flattened = [];
  
  // Ordena os itens do nível atual
  const sortedItems = [...items].sort((a, b) => {
    const orderA = a.order || 0;
    const orderB = b.order || 0;
    return orderA - orderB;
  });

  sortedItems.forEach((item, index) => {
    // Gera código WBS se não existir
    const wbsCode = item.wbs_code || `${parentCode}${parentCode ? '.' : ''}${index + 1}`;
    
    // Adiciona o item atual com informações de hierarquia
    flattened.push({
      ...item,
      wbs_code: wbsCode,
      hierarchy_level: level,
      has_children: item.children && item.children.length > 0,
    });

    // Se tem filhos, processa recursivamente
    if (item.children && item.children.length > 0) {
      const childrenFlattened = flattenHierarchy(item.children, wbsCode, level + 1);
      flattened.push(...childrenFlattened);
    }
  });

  return flattened;
};

/**
 * Gera aba detalhada com todos os itens da EAP
 */
const generateItemsSheet = (items) => {
  if (!items || items.length === 0) {
    return XLSX.utils.aoa_to_sheet([
      ['Nenhum item cadastrado na EAP'],
    ]);
  }

  // Achata a hierarquia mantendo a ordem correta
  const flatItems = flattenHierarchy(items);

  // Cabeçalho
  const headers = [
    'Nível',
    'Código WBS',
    'Nome do Item',
    'Tipo',
    'Responsável',
    'Orçamento',
    'Progresso',
    'Status',
    'Data Início',
    'Data Fim',
    'Observações',
  ];

  // Dados dos itens com hierarquia visual
  const rows = flatItems.map((item) => {
    const level = item.hierarchy_level || 1;
    const indentSymbol = level === 1 ? '▪' : level === 2 ? '  ◦' : '    ·';
    const itemName = `${indentSymbol} ${item.name || 'Sem nome'}`;
    
    return [
      level,                                          // Nível
      item.wbs_code || '-',                          // Código WBS
      itemName,                                       // Nome com indentação
      item.item_type || '-',                         // Tipo
      item.responsible_name || '-',                  // Responsável
      item.budget || 0,                              // Orçamento (número puro)
      (item.progress || 0) / 100,                    // Progresso (decimal para %)
      getStatus(item.progress || 0),                 // Status
      item.start_date || null,                       // Data Início
      item.end_date || null,                         // Data Fim
      item.observations || '-',                      // Observações
    ];
  });

  // Combina cabeçalho com dados
  const sheetData = [headers, ...rows];

  // Cria a planilha
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Aplica estilos
  const styles = createCellStyles();
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  // Estilo do cabeçalho
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = styles.header;
    }
  }

  // Estilo dos dados
  flatItems.forEach((item, idx) => {
    const rowIndex = idx + 1; // +1 porque linha 0 é o cabeçalho
    const itemType = item.item_type || 'default';
    
    // Determina o estilo da linha baseado no tipo
    let rowStyle = styles.normal;
    if (itemType === 'FASE') rowStyle = styles.fase;
    else if (itemType === 'ENTREGA') rowStyle = styles.entrega;
    else if (itemType === 'ATIVIDADE') rowStyle = styles.atividade;

    // Aplica estilo base em todas as colunas
    for (let col = 0; col <= 10; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: col });
      if (worksheet[cellAddress]) {
        // Cria uma cópia do estilo base
        worksheet[cellAddress].s = { ...rowStyle };

        // Estilos específicos por coluna
        if (col === 5) { // Orçamento
          worksheet[cellAddress].s = { ...rowStyle, ...styles.currency };
          worksheet[cellAddress].t = 'n'; // Tipo numérico
        } else if (col === 6) { // Progresso
          worksheet[cellAddress].s = { ...rowStyle, ...styles.percent };
          worksheet[cellAddress].t = 'n'; // Tipo numérico
        } else if (col === 8 || col === 9) { // Datas
          worksheet[cellAddress].s = { ...rowStyle, ...styles.date };
          if (worksheet[cellAddress].v && typeof worksheet[cellAddress].v === 'string') {
            // Converte string de data para número do Excel
            const date = new Date(worksheet[cellAddress].v);
            if (!isNaN(date)) {
              worksheet[cellAddress].t = 'd';
              worksheet[cellAddress].v = date;
            }
          }
        }
      }
    }
  });

  // Define largura das colunas
  const columnWidths = [
    { wch: 6 },  // Nível
    { wch: 10 }, // Código WBS
    { wch: 45 }, // Nome do Item (mais largo para hierarquia)
    { wch: 12 }, // Tipo
    { wch: 20 }, // Responsável
    { wch: 15 }, // Orçamento
    { wch: 10 }, // Progresso
    { wch: 18 }, // Status
    { wch: 12 }, // Data Início
    { wch: 12 }, // Data Fim
    { wch: 35 }, // Observações
  ];
  worksheet['!cols'] = columnWidths;

  // Define altura das linhas
  worksheet['!rows'] = [
    { hpt: 25 }, // Cabeçalho mais alto
    ...flatItems.map(() => ({ hpt: 20 })), // Linhas de dados
  ];

  return worksheet;
};

/**
 * Função principal para exportar a EAP completa em formato Excel
 */
export const exportEAPToExcel = (eapData, projectName, stats) => {
  try {
    // Valida dados de entrada
    if (!eapData) {
      throw new Error('Dados da EAP não fornecidos');
    }

    // Cria o workbook
    const workbook = XLSX.utils.book_new();

    // Aba 1: Resumo
    const summarySheet = generateSummarySheet(eapData, projectName, stats);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

    // Aba 2: Itens Detalhados
    const itemsSheet = generateItemsSheet(eapData.items || []);
    XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Itens da EAP');

    // Gera nome do arquivo
    const projectNameClean = (projectName || 'projeto').replace(/[^a-zA-Z0-9]/g, '_');
    const eapNameClean = (eapData.name || 'eap').replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `EAP_${projectNameClean}_${eapNameClean}_${timestamp}.xlsx`;

    // Exporta o arquivo
    XLSX.writeFile(workbook, fileName);

    return {
      success: true,
      fileName,
      message: 'EAP exportada com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao exportar EAP:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao exportar',
    };
  }
};

/**
 * Exporta apenas os itens em formato simplificado (CSV compatível)
 */
export const exportEAPToCSV = (items) => {
  try {
    if (!items || items.length === 0) {
      throw new Error('Nenhum item para exportar');
    }

    const sortedItems = sortItemsByWBS(items);
    
    const headers = ['Código WBS', 'Nome', 'Tipo', 'Responsável', 'Orçamento', 'Progresso', 'Status'];
    
    const rows = sortedItems.map((item) => [
      item.wbs_code || '-',
      item.name || 'Sem nome',
      item.item_type || '-',
      item.responsible_name || '-',
      item.budget || 0,
      item.progress || 0,
      getStatus(item.progress || 0),
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EAP');

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `EAP_Itens_${timestamp}.csv`;

    XLSX.writeFile(workbook, fileName, { bookType: 'csv' });

    return {
      success: true,
      fileName,
      message: 'Itens exportados com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao exportar',
    };
  }
};

