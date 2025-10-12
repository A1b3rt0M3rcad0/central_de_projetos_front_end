import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import {
  BookOpen,
  Search,
  Home,
  FolderOpen,
  Building2,
  Shield,
  MapPin,
  Users,
  Settings,
  FileText,
  Bell,
  ChevronRight,
  CheckCircle,
  Info,
  Zap,
  Lock,
  BarChart3,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Link2,
  ClipboardCheck,
  ArrowLeft,
  Network,
  Download,
  Layers,
} from "lucide-react";

export default function HelpPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("inicio");

  // Estrutura de conteúdo da ajuda
  const sections = [
    {
      id: "inicio",
      title: "Início Rápido",
      icon: <Home className="w-5 h-5" />,
      color: "blue",
      topics: [
        {
          title: "Bem-vindo ao Sistema de Gestão de Projetos",
          content: `Este sistema foi desenvolvido para centralizar e organizar todo o ciclo de vida dos projetos legislativos municipais, desde sua concepção até a conclusão.`,
        },
        {
          title: "Primeiro Acesso",
          steps: [
            "Faça login com seu CPF e senha fornecidos pelo administrador",
            "Você será direcionado ao Dashboard com visão geral dos projetos",
            "Use o menu lateral para navegar entre as diferentes seções",
            "Seu nível de acesso (Admin, Vereador ou Assessor) determina suas permissões",
          ],
        },
        {
          title: "Níveis de Acesso",
          items: [
            {
              role: "ADMIN",
              permissions: "Acesso total - Criar, editar e deletar tudo",
            },
            {
              role: "VEREADOR",
              permissions: "Visualizar todos os projetos e criar associações",
            },
            {
              role: "ASSESSOR",
              permissions: "Visualizar projetos e auxiliar vereadores",
            },
          ],
        },
      ],
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "indigo",
      topics: [
        {
          title: "Visão Geral do Dashboard",
          content: `O Dashboard oferece uma visão completa e em tempo real de todos os projetos do sistema com gráficos interativos e estatísticas.`,
        },
        {
          title: "Recursos do Dashboard",
          features: [
            {
              name: "Contadores Gerais",
              description:
                "Total de projetos, bairros, empresas e fiscais cadastrados",
            },
            {
              name: "Projetos por Bairro",
              description:
                "Gráfico de barras mostrando distribuição de projetos por localidade",
            },
            {
              name: "Orçamento por Bairro",
              description: "Análise financeira da distribuição de orçamentos",
            },
            {
              name: "Top Performers",
              description:
                "Ranking de fiscais, empresas e vereadores mais ativos",
            },
            {
              name: "Distribuição por Status",
              description:
                "Acompanhamento de projetos: em execução, concluídos, aguardando verba, etc.",
            },
          ],
        },
        {
          title: "Filtros do Dashboard",
          steps: [
            "Use os filtros de status para focar em projetos específicos",
            "Clique nos gráficos para ver detalhes",
            "Dados são atualizados automaticamente",
          ],
        },
      ],
    },
    {
      id: "projetos",
      title: "Gestão de Projetos",
      icon: <FolderOpen className="w-5 h-5" />,
      color: "green",
      topics: [
        {
          title: "Como Criar um Projeto",
          steps: [
            'Clique em "Projetos" no menu lateral',
            'Clique no botão "+ Criar Projeto"',
            "Preencha o Nome do Projeto e selecione o Status",
            "Informe o Orçamento (opcional)",
            "Descreva a Situação do Projeto (opcional)",
            "Defina o Cronograma: Data de Início e Previsão de Conclusão",
            'Clique em "Salvar Projeto"',
          ],
          note: "Apenas usuários ADMIN podem criar projetos",
        },
        {
          title: "Campos do Projeto",
          fields: [
            {
              name: "Nome do Projeto",
              description: "Título identificador do projeto",
              required: true,
            },
            {
              name: "Status do Projeto",
              description:
                "Situação atual (Aguardando Verba, Em Execução, Concluído, etc.)",
              required: true,
            },
            {
              name: "Orçamento",
              description: "Valor total do orçamento do projeto em reais (R$)",
              required: false,
            },
            {
              name: "Situação do Projeto",
              description:
                "Campo de texto livre para descrever detalhadamente a situação atual, avanços, desafios ou observações importantes sobre o projeto",
              required: false,
            },
            {
              name: "Data de Início",
              description: "Data em que o projeto foi iniciado",
              required: false,
            },
            {
              name: "Previsão de Conclusão",
              description: "Data estimada para finalização do projeto",
              required: false,
            },
            {
              name: "Data de Conclusão",
              description:
                "Data real de conclusão (preenchida quando finalizado)",
              required: false,
            },
          ],
        },
        {
          title: "Editando Projetos",
          steps: [
            "Na lista de projetos, clique no ícone de editar (lápis)",
            "Modifique os campos desejados",
            "Cada alteração é registrada no histórico",
            'Clique em "Salvar" para confirmar',
          ],
          warning:
            "Apenas ADMIN pode editar. Todas as alterações ficam registradas no histórico para auditoria.",
        },
        {
          title: "Visualizar Detalhes do Projeto",
          steps: [
            'Clique no ícone de olho (👁️) ou no botão "Ver Detalhes"',
            "Veja card com Orçamento e Cronograma completo",
            "Confira Situação atual e Status do projeto",
            "Visualize todas as Associações: bairros, empresas, fiscais, tipos, vereadores",
            "Acesse documentos anexados ao projeto",
            "Veja o histórico completo de alterações (auditoria)",
            "Acompanhe as fiscalizações (Work Projects) realizadas",
          ],
        },
        {
          title: "Status vs Situação - Entenda a Diferença",
          content: `É importante entender a diferença entre estes dois campos:`,
          items: [
            {
              name: "Status do Projeto",
              description:
                "Etapa formal/oficial do projeto (Ex: Aguardando Verba, Em Execução, Concluído). É um campo de seleção com opções pré-definidas.",
            },
            {
              name: "Situação do Projeto",
              description:
                "Descrição livre e detalhada do que está acontecendo (Ex: 'Aguardando aprovação da câmara', 'Obra 70% concluída, faltam acabamentos'). É um campo de texto aberto.",
            },
          ],
          note: "Use o Status para classificação oficial e a Situação para detalhes específicos",
        },
        {
          title: "Orçamento do Projeto",
          content: `O campo Orçamento registra o valor total disponível para o projeto em reais (R$).`,
          features: [
            {
              name: "Formatação Automática",
              description:
                "Digite o valor e o sistema formata automaticamente para moeda brasileira",
            },
            {
              name: "Análise por Bairro",
              description: "Veja no Dashboard o orçamento total por bairro",
            },
            {
              name: "Validação",
              description: "O sistema impede valores negativos",
            },
          ],
          note: "O orçamento é opcional, mas recomendado para análises financeiras no Dashboard",
        },
        {
          title: "Entendendo o Cronograma",
          content: `Cada projeto possui 3 datas importantes que ajudam no acompanhamento:`,
          items: [
            {
              name: "Data de Início",
              description: "Quando o projeto começou oficialmente",
            },
            {
              name: "Previsão de Conclusão",
              description:
                "Data estimada para finalizar (pode ser ajustada conforme necessário)",
            },
            {
              name: "Data de Conclusão",
              description:
                "Data real quando o projeto foi concluído (preenchida apenas ao finalizar)",
            },
          ],
          note: "O sistema valida automaticamente que as datas estejam em ordem lógica (início < previsão < conclusão)",
        },
        {
          title: "Busca e Filtros",
          features: [
            {
              name: "Busca Global",
              description:
                "Digite qualquer termo para buscar em todos os campos",
            },
            {
              name: "Paginação",
              description: "Escolha 10, 25, 50 ou 100 projetos por página",
            },
            {
              name: "Ordenação",
              description: "Clique no cabeçalho das colunas para ordenar",
            },
          ],
        },
      ],
    },
    {
      id: "associacoes",
      title: "Associações",
      icon: <Link2 className="w-5 h-5" />,
      color: "purple",
      topics: [
        {
          title: "O que são Associações?",
          content: `Associações vinculam projetos a bairros, empresas executoras, fiscais responsáveis, tipos e vereadores. Um projeto pode ter múltiplas associações.`,
        },
        {
          title: "Como Associar Entidades a um Projeto",
          steps: [
            'Na página do projeto, vá até "Gerenciar Associações"',
            "Ou use o menu: Projetos → Associações",
            "Selecione o projeto que deseja associar",
            "Escolha as entidades: Bairros, Empresas, Fiscais, Tipos, Vereadores",
            'Clique em "Salvar Associações"',
          ],
        },
        {
          title: "Tipos de Associações",
          items: [
            {
              type: "Bairros",
              description:
                "Vincule o projeto a um ou mais bairros beneficiados",
              icon: "MapPin",
            },
            {
              type: "Empresas",
              description: "Empresas executoras responsáveis pela obra",
              icon: "Building2",
            },
            {
              type: "Fiscais",
              description: "Profissionais que fiscalizam a execução e situação",
              icon: "Shield",
            },
            {
              type: "Tipos",
              description: "Categorias do projeto (Calçamento, Asfalto, etc.)",
              icon: "FolderOpen",
            },
            {
              type: "Vereadores",
              description: "Legisladores responsáveis pelo projeto",
              icon: "Users",
            },
          ],
        },
        {
          title: "Removendo Associações",
          steps: [
            "Acesse a página de associações do projeto",
            "Clique no X ao lado da entidade que deseja remover",
            "Confirme a remoção",
          ],
          warning: "Apenas ADMIN pode gerenciar associações",
        },
      ],
    },
    {
      id: "fiscalizacao",
      title: "Fiscalização",
      icon: <ClipboardCheck className="w-5 h-5" />,
      color: "orange",
      topics: [
        {
          title: "Sistema de Fiscalização (Work Projects)",
          content: `Os Work Projects são registros de fiscalização realizados em campo pelos fiscais. Cada fiscalização pode conter fotos, documentos e relatórios sobre a situação atual do projeto.`,
        },
        {
          title: "Criar Fiscalização (Work Project)",
          steps: [
            'Acesse "Projetos" → "Fiscalizações"',
            'Clique em "+ Nova Fiscalização"',
            "Selecione o projeto que será fiscalizado",
            "Selecione o fiscal responsável",
            "Adicione um título descritivo (Ex: 'Vistoria semanal - Semana 3')",
            "Descreva detalhadamente o que foi observado na fiscalização",
            "Faça upload de fotos da obra/local (opcional mas recomendado)",
            "Anexe documentos adicionais: relatórios, medições, etc. (opcional)",
            'Clique em "Salvar Fiscalização"',
            "Uma notificação será enviada automaticamente aos administradores",
          ],
          note: "Fiscalizações podem ser criadas por Administradores via painel web ou por Fiscais através do Dashboard de Fiscais",
        },
        {
          title: "Visualizar Fiscalizações",
          steps: [
            "Na página do projeto, veja a seção de Fiscalizações",
            "Ou acesse via Menu → Projetos → Fiscalizações",
            "Clique para ver detalhes completos",
            "Visualize fotos e documentos anexados",
          ],
        },
        {
          title: "Fiscalizações por Fiscal",
          steps: [
            'Acesse "Fiscais" → Selecione um fiscal',
            'Veja a aba "Últimas Fiscalizações"',
            "Acompanhe o trabalho realizado pelo fiscal",
          ],
        },
        {
          title: "Dashboard de Fiscais",
          content: `Fiscais possuem um painel dedicado com login separado (email + senha) onde podem acompanhar seus projetos, criar fiscalizações e gerenciar documentos.`,
          steps: [
            "Acesse via /fiscal/login",
            "Faça login com email e senha do fiscal",
            "Veja dashboard com seus projetos",
            "Crie fiscalizações diretamente",
            "Faça upload de fotos e documentos",
            "Visualize histórico de fiscalizações",
          ],
          note: "O Dashboard de Fiscais é otimizado para acesso em tablets e dispositivos móveis",
        },
      ],
    },
    {
      id: "eap",
      title: "EAP - Estrutura Analítica",
      icon: <Network className="w-5 h-5" />,
      color: "indigo",
      topics: [
        {
          title: "O que é a EAP?",
          content: `A EAP (Estrutura Analítica do Projeto) ou WBS (Work Breakdown Structure) é uma ferramenta fundamental de gerenciamento que decompõe o projeto em componentes menores e gerenciáveis, organizados hierarquicamente. Ela facilita o planejamento, controle de custos, acompanhamento de progresso e distribuição de responsabilidades.`,
        },
        {
          title: "Estrutura Hierárquica da EAP",
          content: `A EAP é organizada em 4 níveis hierárquicos, cada um com sua função específica:`,
          items: [
            {
              type: "📋 Fase (Nível 1)",
              description:
                "Agrupamento principal que representa grandes etapas do projeto. Ex: 'Planejamento', 'Execução', 'Finalização'",
            },
            {
              type: "📦 Entrega (Nível 2)",
              description:
                "Resultados tangíveis dentro de uma fase. Ex: 'Fundação', 'Estrutura', 'Acabamento'",
            },
            {
              type: "✅ Atividade (Nível 3)",
              description:
                "Tarefas executáveis que geram as entregas. Ex: 'Escavação', 'Concretagem', 'Impermeabilização'",
            },
            {
              type: "📝 Tarefa (Nível 4)",
              description:
                "Menor unidade de trabalho, subtarefas específicas. Ex: 'Preparar materiais', 'Executar serviço', 'Conferir qualidade'",
            },
          ],
          note: "A hierarquia DEVE ser respeitada: Fases contêm Entregas, Entregas contêm Atividades, Atividades contêm Tarefas",
        },
        {
          title: "Código WBS - Identificação Hierárquica",
          content: `Cada item da EAP possui um código WBS único que identifica sua posição na hierarquia:`,
          items: [
            {
              name: "Nível 1 (Fase)",
              description: "Código: 1, 2, 3, 4...",
            },
            {
              name: "Nível 2 (Entrega)",
              description: "Código: 1.1, 1.2, 2.1, 2.2...",
            },
            {
              name: "Nível 3 (Atividade)",
              description: "Código: 1.1.1, 1.1.2, 1.2.1...",
            },
            {
              name: "Nível 4 (Tarefa)",
              description: "Código: 1.1.1.1, 1.1.1.2...",
            },
          ],
          note: "Os códigos são gerados automaticamente ao criar novos itens, mantendo a numeração sequencial correta",
        },
        {
          title: "Criar uma EAP para um Projeto",
          steps: [
            "Acesse a página do projeto desejado",
            'Clique em "EAP" no menu ou card do projeto',
            'Se o projeto não tiver EAP, clique em "Criar EAP"',
            "Defina um nome descritivo (Ex: 'EAP - Obra de Pavimentação')",
            "Adicione uma descrição explicando a estrutura do projeto",
            'Clique em "Criar EAP"',
          ],
          note: "Cada projeto pode ter apenas UMA EAP. Apenas usuários ADMIN podem criar EAPs",
        },
        {
          title: "Adicionar Itens à EAP",
          steps: [
            "Na página da EAP, clique em 'Nova Fase' para criar o primeiro nível",
            "Preencha os campos obrigatórios: Nome, Responsável, Datas, Orçamento",
            "O código WBS é gerado automaticamente",
            "Para adicionar subitens, clique no botão '+' ao lado de um item existente",
            "O tipo do filho é sugerido automaticamente (Fase → Entrega → Atividade → Tarefa)",
            "Continue estruturando até o nível de detalhe desejado",
            "Use 'Expandir Tudo' para visualizar a estrutura completa",
          ],
          warning:
            "Não é possível criar uma Atividade diretamente em uma Fase, ou uma Tarefa diretamente em uma Entrega. Respeite a hierarquia!",
        },
        {
          title: "Campos dos Itens da EAP",
          fields: [
            {
              name: "Código WBS",
              description: "Código hierárquico único (gerado automaticamente)",
              required: true,
            },
            {
              name: "Nome",
              description: "Título descritivo do item",
              required: true,
            },
            {
              name: "Tipo",
              description: "Fase, Entrega, Atividade ou Tarefa",
              required: true,
            },
            {
              name: "Descrição",
              description: "Detalhamento do que será realizado",
              required: false,
            },
            {
              name: "Responsável",
              description: "Nome da pessoa ou equipe responsável",
              required: false,
            },
            {
              name: "Data de Início",
              description: "Quando o item começa a ser executado",
              required: true,
            },
            {
              name: "Data de Término",
              description: "Prazo final para conclusão do item",
              required: true,
            },
            {
              name: "Orçamento (R$)",
              description: "Valor alocado para este item específico",
              required: true,
            },
            {
              name: "Progresso (%)",
              description: "Percentual de conclusão (0-100%)",
              required: true,
            },
            {
              name: "Status",
              description:
                "Não Iniciado, Em Andamento, Concluído, Pausado, Cancelado ou Bloqueado",
              required: true,
            },
          ],
        },
        {
          title: "Controle de Orçamento Inteligente",
          content: `O sistema realiza validações automáticas de orçamento para garantir consistência financeira:`,
          features: [
            {
              name: "Validação Hierárquica",
              description:
                "A soma dos orçamentos dos itens filhos não pode exceder o orçamento do item pai",
            },
            {
              name: "Alerta de Ultrapassagem",
              description:
                "Se tentar alocar mais que o disponível, o sistema exibe mensagem informando o valor excedente",
            },
            {
              name: "Orçamento Total do Projeto",
              description:
                "A soma de todas as Fases (nível raiz) é comparada com o orçamento total do projeto",
            },
            {
              name: "Visualização Clara",
              description:
                "Cards mostram orçamento alocado vs. disponível com indicadores visuais (verde/vermelho)",
            },
          ],
          note: "O orçamento de um item pai deve comportar a soma dos orçamentos de todos os seus filhos",
        },
        {
          title: "Cálculo Automático de Progresso",
          content: `O progresso dos itens com filhos é calculado automaticamente baseado no valor executado:`,
          items: [
            {
              name: "Itens sem Filhos",
              description:
                "Progresso é definido manualmente (0-100%) pelo usuário",
            },
            {
              name: "Itens com Filhos",
              description:
                "Progresso é calculado automaticamente: (Valor Executado dos Filhos ÷ Orçamento Total) × 100",
            },
            {
              name: "Valor Executado",
              description:
                "Calculado como: Orçamento do Item × (Progresso / 100). Ex: R$ 10.000 com 50% = R$ 5.000 executado",
            },
            {
              name: "Propagação para Cima",
              description:
                "O progresso sobe na hierarquia: uma Fase mostra o progresso agregado de todas suas Entregas",
            },
          ],
          note: "Não é possível editar manualmente o progresso de itens que possuem filhos - ele é sempre calculado",
        },
        {
          title: "Status Automático baseado no Progresso",
          content: `O status do item é atualizado automaticamente conforme o progresso evolui:`,
          items: [
            {
              name: "Progresso = 0%",
              description: "Status: Não Iniciado (automático)",
            },
            {
              name: "Progresso entre 1-99%",
              description:
                "Status: Em Andamento (pode ser alterado para Pausado ou Cancelado)",
            },
            {
              name: "Progresso = 100%",
              description: "Status: Concluído (automático)",
            },
          ],
          note: "Enquanto estiver entre 1-99%, você pode mudar para 'Pausado' ou 'Cancelado' conforme necessário",
        },
        {
          title: "Editar e Gerenciar Itens",
          steps: [
            "Clique no ícone de lápis (✏️) ao lado do item",
            "Modifique os campos desejados",
            "O sistema valida as alterações (datas, orçamento, hierarquia)",
            'Clique em "Salvar" para confirmar',
            "Para adicionar subitens, use o botão '+' (Plus)",
            "Para excluir, clique no ícone de lixeira (🗑️) - isso excluirá também todos os filhos",
          ],
          warning:
            "Ao excluir um item pai, TODOS os seus filhos (subitens) também serão excluídos permanentemente",
        },
        {
          title: "Visualizações da EAP",
          features: [
            {
              name: "Visualização Lista Hierárquica",
              description:
                "Estrutura colapsável com indentação visual, orçamento, progresso e ações inline. Ideal para edição rápida",
            },
            {
              name: "Visualização em Árvore",
              description:
                "Diagrama gráfico mostrando todas as conexões e relações entre itens. Perfeito para apresentações",
            },
            {
              name: "Expandir/Colapsar",
              description:
                "Botões para expandir ou colapsar toda a estrutura de uma vez",
            },
            {
              name: "Indicadores Visuais",
              description:
                "Cores diferentes para cada tipo (Fase: azul, Entrega: verde, Atividade: roxo, Tarefa: amarelo)",
            },
          ],
        },
        {
          title: "Estatísticas da EAP",
          content: `O sistema exibe automaticamente estatísticas completas da estrutura:`,
          items: [
            {
              name: "Progresso Geral",
              description:
                "Percentual médio de conclusão de todas as fases raiz com barra de progresso visual",
            },
            {
              name: "Orçamento Total",
              description:
                "Soma de todos os orçamentos alocados + comparação com orçamento do projeto",
            },
            {
              name: "Estrutura",
              description:
                "Contagem de quantas Fases, Entregas, Atividades e Tarefas existem",
            },
            {
              name: "Status",
              description:
                "Quantos itens estão: Concluídos, Em Andamento e Não Iniciados",
            },
          ],
        },
        {
          title: "Exportar EAP para Excel",
          steps: [
            'Na página da EAP, clique em "Exportar"',
            "O sistema gera um arquivo Excel (.xlsx) com 2 abas:",
            "• Aba 'Resumo': Informações gerais, estatísticas e orçamento total",
            "• Aba 'Itens da EAP': Lista completa com hierarquia visual, formatação colorida por tipo",
            "O arquivo é baixado automaticamente com nome: EAP_[Projeto]_[Data].xlsx",
            "Abra no Excel/LibreOffice para visualizar, imprimir ou compartilhar",
          ],
          note: "A exportação preserva a hierarquia visual com indentação, cores e formatação profissional",
        },
        {
          title: "Editar/Excluir a EAP Completa",
          steps: [
            'Use o botão "Editar EAP" para alterar nome e descrição da estrutura',
            'O botão "Excluir EAP" remove toda a estrutura analítica',
            "Ao excluir, TODOS os itens (fases, entregas, atividades, tarefas) são removidos",
            "Uma confirmação será exibida mostrando quantos itens serão excluídos",
            "Esta ação é IRREVERSÍVEL - não há como desfazer",
          ],
          warning:
            "Apenas ADMIN pode editar ou excluir EAPs. Tenha certeza antes de excluir!",
        },
        {
          title: "Boas Práticas ao Usar EAP",
          tips: [
            "Comece com Fases macro e vá detalhando gradualmente",
            "Use nomes claros e descritivos para facilitar compreensão",
            "Defina responsáveis para cada item garantindo accountability",
            "Revise datas periodicamente e ajuste conforme a realidade do projeto",
            "Atualize o progresso regularmente para manter dados confiáveis",
            "Use a visualização em árvore para apresentações e reuniões",
            "Exporte para Excel ao final de cada mês para documentação",
            "Distribua o orçamento de forma realista entre os itens",
          ],
        },
        {
          title: "Permissões de Acesso",
          items: [
            {
              role: "ADMIN",
              permissions:
                "Criar EAP, Criar/Editar/Excluir itens, Editar/Excluir EAP, Exportar",
            },
            {
              role: "VEREADOR",
              permissions: "Visualizar EAP e seus itens, Exportar",
            },
            {
              role: "ASSESSOR",
              permissions: "Visualizar EAP e seus itens, Exportar",
            },
          ],
        },
      ],
    },
    {
      id: "gantt",
      title: "Cronograma de Gantt",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "purple",
      topics: [
        {
          title: "O que é o Cronograma de Gantt?",
          content: `O Cronograma de Gantt é uma ferramenta visual de gerenciamento de projetos que exibe as tarefas em uma linha do tempo horizontal. Ele é gerado AUTOMATICAMENTE a partir da EAP do projeto, mostrando as barras de progresso, durações, datas e responsáveis de forma gráfica e interativa.`,
        },
        {
          title: "Como Funciona no Sistema",
          content: `O Gantt está diretamente integrado com a EAP. Quando você cria ou modifica itens na EAP, o cronograma é atualizado automaticamente. Ele organiza visualmente todas as fases, entregas, atividades e tarefas do projeto em um gráfico de barras horizontais ao longo do tempo.`,
        },
        {
          title: "Acessar o Cronograma de Gantt",
          steps: [
            'Na página do projeto, clique no botão "Cronograma" ou no menu lateral',
            "O sistema carrega automaticamente a EAP e gera o gráfico Gantt",
            "Se o projeto não tiver EAP criada, você verá uma mensagem orientando a criar primeiro",
            "O Gantt exibe TODAS as tarefas da EAP organizadas hierarquicamente",
          ],
          note: "O Gantt só funciona se o projeto tiver uma EAP criada. Sem EAP, não há cronograma.",
        },
        {
          title: "Componentes do Gantt",
          features: [
            {
              name: "Grid de Tarefas (Esquerda)",
              description:
                "Lista hierárquica mostrando código, nome, datas, duração, responsável, progresso, orçamento e status de cada tarefa",
            },
            {
              name: "Linha do Tempo (Direita)",
              description:
                "Barras coloridas representando a duração de cada tarefa ao longo do tempo (dias, semanas ou meses)",
            },
            {
              name: "Barras de Progresso",
              description:
                "Dentro de cada barra, uma área preenchida mostra o percentual de conclusão (0-100%)",
            },
            {
              name: "Linha 'Hoje'",
              description:
                "Uma linha vertical vermelha marca a data atual no cronograma, facilitando identificar atrasos",
            },
            {
              name: "Cards de Estatísticas",
              description:
                "No topo: Total de Tarefas, Concluídas, Em Andamento, Não Iniciadas e Atrasadas",
            },
          ],
        },
        {
          title: "Cores das Barras (Por Tipo)",
          items: [
            {
              type: "🔵 Azul",
              description: "Fase - Agrupamento principal do projeto",
            },
            {
              type: "🟢 Verde",
              description: "Entrega - Resultado tangível esperado",
            },
            {
              type: "🟣 Roxo",
              description: "Atividade - Trabalho executável específico",
            },
            {
              type: "🟠 Laranja",
              description: "Tarefa - Menor unidade de trabalho",
            },
            {
              type: "🔴 Vermelho",
              description:
                "Atrasada - Tarefa que passou da data de término e não está 100% concluída",
            },
          ],
        },
        {
          title: "Controles de Visualização",
          features: [
            {
              name: "Zoom de Escala de Tempo",
              description:
                "Botões 'Dia', 'Semana' e 'Mês' para ajustar o nível de detalhe do cronograma. Dia = mais detalhe, Mês = visão macro",
            },
            {
              name: "Filtro por Status",
              description:
                "Filtre para ver apenas: Não Iniciados, Em Andamento, Concluídos, Pausados ou Atrasados. Clique no badge 'Filtro ativo' para limpar",
            },
            {
              name: "Botão Tela Cheia",
              description:
                "Expande o Gantt para tela inteira, ideal para apresentações ou análise detalhada. Pressione ESC ou clique 'Sair' para voltar",
            },
            {
              name: "Botão Atualizar",
              description:
                "Recarrega os dados mais recentes da EAP e recalcula o cronograma",
            },
            {
              name: "Visualização Alternativa",
              description:
                "Alterne entre 'Gantt' (gráfico) e 'Lista' (tabela expandível) usando os botões no topo",
            },
          ],
        },
        {
          title: "Como Interpretar o Gantt",
          tips: [
            "Barras LONGAS = tarefas de longa duração. Barras CURTAS = tarefas rápidas",
            "Barras que se SOBREPÕEM = tarefas acontecendo ao mesmo tempo",
            "Barras à ESQUERDA da linha 'Hoje' = tarefas passadas. À DIREITA = futuras",
            "Barras VERMELHAS = Atenção! Tarefa atrasada e precisa de ação",
            "Progresso VERDE (100%) = Tarefa concluída com sucesso",
            "Progresso AMARELO (<50%) = Tarefa no início, acompanhar evolução",
          ],
        },
        {
          title: "Tooltip Interativo",
          content: `Passe o mouse sobre qualquer barra do Gantt para ver um tooltip com informações detalhadas: Nome completo, Tipo, Responsável, Status, Progresso, Duração em dias, Datas de início e fim, Orçamento e Descrição (se houver).`,
        },
        {
          title: "Filtros de Status - Como Usar",
          steps: [
            'Selecione um status no dropdown "Filtrar Status"',
            "O Gantt exibe APENAS as tarefas que correspondem ao filtro",
            "A hierarquia é mantida: pais das tarefas filtradas também aparecem",
            "Um badge azul 'Filtro ativo' aparece. Clique no × para limpar",
            "Útil para focar em tarefas específicas sem distrações",
          ],
          examples: [
            "Filtrar 'Atrasados' → Identifica rapidamente o que precisa de atenção",
            "Filtrar 'Em Andamento' → Vê o que está sendo trabalhado agora",
            "Filtrar 'Concluídos' → Revisa o trabalho já finalizado",
          ],
        },
        {
          title: "Modo Tela Cheia",
          steps: [
            'Clique no botão "Tela Cheia" no canto superior direito',
            "O Gantt expande para ocupar toda a tela",
            "Ideal para apresentações em reuniões ou análises detalhadas",
            "Todos os controles continuam funcionando (zoom, filtro, scroll)",
            "Pressione ESC no teclado ou clique 'Sair' para voltar ao normal",
          ],
          note: "Em tela cheia, o Gantt aproveita melhor o espaço da tela, mostrando mais tarefas simultaneamente",
        },
        {
          title: "Visualização em Lista",
          content: `Além do gráfico Gantt tradicional, há uma visualização alternativa em LISTA HIERÁRQUICA. Clique no botão 'Lista' no topo para alternar.`,
          features: [
            {
              name: "Estrutura Colapsável",
              description:
                "Expanda/colapse itens clicando nas setas para navegar pela hierarquia",
            },
            {
              name: "Colunas Completas",
              description:
                "Vê todas as informações em formato tabular: Nome, Responsável, Período, Orçamento, Progresso e Status",
            },
            {
              name: "Indentação Visual",
              description:
                "Níveis hierárquicos são diferenciados por indentação e cor de fundo",
            },
            {
              name: "Total no Rodapé",
              description:
                "Orçamento total e quantidade de itens raiz são exibidos no final",
            },
          ],
        },
        {
          title: "Sincronização com a EAP",
          content: `O Gantt é 100% sincronizado com a EAP. Qualquer mudança na EAP reflete automaticamente no cronograma:`,
          items: [
            {
              name: "Criar item na EAP",
              description:
                "Nova barra aparece no Gantt na posição temporal correspondente",
            },
            {
              name: "Alterar datas na EAP",
              description:
                "Barra se move horizontalmente no cronograma para nova posição",
            },
            {
              name: "Atualizar progresso",
              description: "Barra de progresso dentro da tarefa aumenta",
            },
            {
              name: "Mudar status",
              description:
                "Cor e aparência da barra mudam conforme novo status",
            },
            {
              name: "Excluir item da EAP",
              description: "Barra desaparece do Gantt",
            },
          ],
        },
        {
          title: "Estatísticas em Tempo Real",
          content: `Os cards no topo do Gantt mostram estatísticas calculadas automaticamente:`,
          items: [
            {
              name: "Total de Tarefas",
              description:
                "Contagem de todos os itens da EAP (fases + entregas + atividades + tarefas)",
            },
            {
              name: "Concluídas",
              description:
                "Tarefas com status 'Concluído' e progresso 100% (card verde)",
            },
            {
              name: "Em Andamento",
              description: "Tarefas sendo executadas atualmente (card azul)",
            },
            {
              name: "Não Iniciadas",
              description:
                "Tarefas com status 'Não Iniciado' e progresso 0% (card cinza)",
            },
            {
              name: "Atrasadas",
              description:
                "Tarefas que ultrapassaram a data de término e progresso < 100% (card vermelho)",
            },
          ],
        },
        {
          title: "Identificar Tarefas Atrasadas",
          steps: [
            "Olhe para a linha vermelha vertical 'Hoje' no cronograma",
            "Barras que terminam À ESQUERDA dessa linha e não estão 100% concluídas = ATRASADAS",
            "Essas barras ficam VERMELHAS automaticamente",
            "Use o filtro 'Atrasados' para ver apenas essas tarefas",
            "Priorize ações para colocar essas tarefas em dia",
          ],
          warning:
            "Tarefas atrasadas impactam o cronograma geral do projeto. Acompanhe o card 'Atrasadas' no topo!",
        },
        {
          title: "Quando Usar o Gantt",
          tips: [
            "Planejamento: Visualize o cronograma completo antes de iniciar o projeto",
            "Reuniões: Apresente o andamento visual para stakeholders",
            "Acompanhamento: Monitore progresso comparando barras com a linha 'Hoje'",
            "Identificação de problemas: Encontre rapidamente tarefas atrasadas",
            "Replanejamento: Veja impacto de mudanças de datas",
            "Comunicação: Compartilhe visão clara do cronograma com a equipe",
          ],
        },
        {
          title: "Boas Práticas com Gantt",
          tips: [
            "Atualize o progresso das tarefas na EAP regularmente (semanal ou quinzenal)",
            "Use o zoom adequado: 'Dia' para curto prazo, 'Mês' para visão geral",
            "Identifique tarefas atrasadas semanalmente e tome ações corretivas",
            "Apresente o Gantt em modo tela cheia em reuniões de acompanhamento",
            "Exporte a visualização (screenshot) para documentar o status do projeto",
            "Combine Gantt + EAP: use o Gantt para visão temporal e a EAP para detalhes",
          ],
        },
        {
          title: "Limitações e Observações",
          items: [
            {
              name: "Somente Visualização",
              description:
                "O Gantt é READ-ONLY. Para editar tarefas, use a página da EAP",
            },
            {
              name: "Sem Dependências (ainda)",
              description:
                "Não há setas conectando tarefas dependentes. Isso será adicionado em versão futura",
            },
            {
              name: "Requer EAP",
              description:
                "Sem EAP criada, o Gantt não pode ser gerado. Crie a EAP primeiro",
            },
            {
              name: "Performance",
              description:
                "Projetos com muitas tarefas (>200) podem demorar alguns segundos para carregar",
            },
          ],
        },
        {
          title: "Permissões de Acesso",
          items: [
            {
              role: "ADMIN",
              permissions:
                "Visualizar Gantt, usar todos os controles, tela cheia, filtros",
            },
            {
              role: "VEREADOR",
              permissions:
                "Visualizar Gantt, usar todos os controles, tela cheia, filtros",
            },
            {
              role: "ASSESSOR",
              permissions:
                "Visualizar Gantt, usar todos os controles, tela cheia, filtros",
            },
          ],
          note: "Todos os usuários podem visualizar o Gantt. Apenas ADMIN pode editar itens (via EAP).",
        },
      ],
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: <FileText className="w-5 h-5" />,
      color: "red",
      topics: [
        {
          title: "Sistema de Documentos",
          content: `O sistema permite anexar documentos (PDF, Word, Excel, imagens) a projetos e fiscalizações. Todos os arquivos ficam organizados e acessíveis.`,
        },
        {
          title: "Upload de Documentos",
          steps: [
            'Na página do projeto, clique em "Gerenciar Documentos"',
            'Ou acesse Menu → Documentos → "+ Adicionar Documento"',
            "Selecione o projeto",
            "Escolha o arquivo (PDF, DOC, XLS, JPG, PNG)",
            "Aguarde o upload completar",
          ],
        },
        {
          title: "Tipos de Documentos Suportados",
          content: `O sistema aceita diversos formatos de arquivo para melhor organização documental:`,
          items: [
            {
              format: "PDF (.pdf)",
              description:
                "Ideal para: Contratos, leis, decretos, relatórios oficiais, projetos técnicos",
            },
            {
              format: "Word (.doc, .docx)",
              description:
                "Ideal para: Documentos editáveis, atas, ofícios, propostas",
            },
            {
              format: "Excel (.xls, .xlsx)",
              description:
                "Ideal para: Planilhas orçamentárias, cronogramas, medições, relatórios financeiros",
            },
            {
              format: "Imagens (.jpg, .jpeg, .png)",
              description:
                "Ideal para: Fotos de obras, plantas, croquis, infográficos",
            },
          ],
          note: "Os arquivos ficam armazenados de forma segura e organizada por projeto",
        },
        {
          title: "Visualizar e Baixar",
          steps: [
            "Na lista de documentos, clique no nome do arquivo",
            "O documento será aberto para visualização",
            'Use o botão "Download" para salvar localmente',
          ],
        },
        {
          title: "Deletar Documentos",
          steps: [
            "Apenas ADMIN pode deletar documentos",
            "Clique no ícone de lixeira ao lado do documento",
            "Confirme a exclusão",
          ],
          warning: "A exclusão é permanente e não pode ser desfeita",
        },
      ],
    },
    {
      id: "notificacoes",
      title: "Notificações",
      icon: <Bell className="w-5 h-5" />,
      color: "yellow",
      topics: [
        {
          title: "Sistema de Notificações",
          content: `Receba alertas em tempo real sobre eventos importantes do sistema: novas fiscalizações, atualizações de projetos e mensagens administrativas.`,
        },
        {
          title: "Tipos de Notificações",
          items: [
            {
              type: "Fiscalização Criada",
              description:
                "Quando um fiscal adiciona uma nova fiscalização em algum projeto",
              icon: "ClipboardCheck",
            },
            {
              type: "Atualização de Projeto",
              description: "Quando um projeto que você acompanha é modificado",
              icon: "Info",
            },
            {
              type: "Alerta do Sistema",
              description: "Avisos importantes sobre o sistema",
              icon: "Bell",
            },
            {
              type: "Mensagem Admin",
              description: "Comunicações diretas da administração",
              icon: "Shield",
            },
            {
              type: "Alerta para Fiscal",
              description: "Notificações específicas para fiscais",
              icon: "ClipboardCheck",
            },
          ],
        },
        {
          title: "Como Usar",
          steps: [
            "Clique no ícone de sino (🔔) no topo da página",
            "Veja suas notificações não lidas (badge com número)",
            "Clique em uma notificação para marcá-la como lida",
            'Use "Marcar todas como lidas" para limpar todas de uma vez',
            'Acesse "Ver Todas" para histórico completo',
          ],
        },
        {
          title: "Configurações",
          content: `As notificações são atualizadas automaticamente a cada 30 segundos. Você pode acessar o histórico completo na página de Notificações.`,
        },
      ],
    },
    {
      id: "fiscal-dashboard",
      title: "Dashboard de Fiscais",
      icon: <Shield className="w-5 h-5" />,
      color: "slate",
      topics: [
        {
          title: "O que é o Dashboard de Fiscais?",
          content: `É um painel separado e exclusivo para fiscais, com login próprio (email + senha), otimizado para trabalho em campo usando tablets ou smartphones.`,
        },
        {
          title: "Como Acessar",
          steps: [
            "Navegue para /fiscal/login",
            "Faça login com seu email e senha de fiscal",
            "Você será direcionado ao seu dashboard personalizado",
          ],
          note: "Fiscais NÃO usam o mesmo login (CPF) dos vereadores/assessores",
        },
        {
          title: "Funcionalidades do Dashboard de Fiscais",
          features: [
            {
              name: "Meus Projetos",
              description: "Veja todos os projetos que você fiscaliza",
            },
            {
              name: "Criar Fiscalizações",
              description: "Registre fiscalizações com fotos e documentos",
            },
            {
              name: "Minhas Fiscalizações",
              description: "Histórico completo de todas suas fiscalizações",
            },
            {
              name: "Perfil",
              description: "Gerencie seus dados pessoais",
            },
          ],
        },
        {
          title: "Diferenças do Painel Principal",
          items: [
            {
              name: "Login Separado",
              description: "Fiscais usam email + senha, não CPF",
            },
            {
              name: "Interface Simplificada",
              description: "Foco nas fiscalizações, sem acesso administrativo",
            },
            {
              name: "Otimizado para Mobile",
              description: "Funciona bem em tablets e smartphones",
            },
            {
              name: "Permissões Limitadas",
              description: "Fiscais só veem e editam seus próprios projetos",
            },
          ],
        },
      ],
    },
    {
      id: "entidades",
      title: "Gerenciar Entidades",
      icon: <Settings className="w-5 h-5" />,
      color: "teal",
      topics: [
        {
          title: "Bairros",
          icon: "MapPin",
          steps: [
            'Acesse Menu → "Bairros"',
            'Clique em "+ Criar Bairro" para adicionar novo',
            "Liste todos os bairros cadastrados",
            "Veja quais projetos estão vinculados a cada bairro",
            "Edite ou delete bairros (apenas ADMIN)",
          ],
        },
        {
          title: "Empresas",
          icon: "Building2",
          steps: [
            'Acesse Menu → "Empresas"',
            "Cadastre empresas executoras de obras",
            "Associe empresas aos projetos que elas executam",
            "Visualize todos os projetos de uma empresa",
            "Acompanhe o desempenho das empresas",
          ],
        },
        {
          title: "Fiscais",
          icon: "Shield",
          steps: [
            'Acesse Menu → "Fiscais"',
            "Cadastre novos fiscais com email e telefone",
            "Associe fiscais aos projetos",
            "Visualize o resumo de atividades de cada fiscal",
            "Acompanhe fiscalizações realizadas",
          ],
          note: "Fiscais têm login próprio para acessar o Dashboard de Fiscais (/fiscal/login)",
        },
        {
          title: "Usuários (Vereadores/Assessores)",
          icon: "Users",
          steps: [
            'Acesse Menu → "Usuários"',
            "Cadastre vereadores e assessores",
            "Defina o nível de acesso (Role)",
            "Associe vereadores aos seus projetos",
            "Gerencie permissões e senhas",
          ],
        },
        {
          title: "Status",
          examples: [
            "Aguardando Verba",
            "Em Projeto",
            "Em Execução",
            "Pausado",
            "Concluído",
            "Cancelado",
          ],
          steps: [
            'Acesse Menu → "Status"',
            "Crie status personalizados para seu fluxo",
            "Use para categorizar etapas dos projetos",
          ],
        },
        {
          title: "Tipos de Projetos",
          examples: ["Calçamento", "Asfalto", "Infraestrutura", "Social"],
          steps: [
            'Acesse Menu → "Tipos"',
            "Crie categorias de projetos",
            "Organize projetos por tipo",
            "Facilite análises e relatórios",
          ],
        },
      ],
    },
    {
      id: "recursos",
      title: "Recursos Avançados",
      icon: <Zap className="w-5 h-5" />,
      color: "amber",
      topics: [
        {
          title: "Histórico de Alterações (Auditoria)",
          content: `Toda modificação em um projeto é registrada automaticamente com data, hora e responsável. Isso garante rastreabilidade completa e transparência para compliance governamental.`,
          steps: [
            'Na página do projeto, clique em "Ver Histórico"',
            "Veja todas as alterações realizadas cronologicamente",
            "Identifique quem fez cada mudança e quando",
            "Compare valores antigos → valores novos",
            "Exporte relatórios de auditoria se necessário",
          ],
        },
        {
          title: "Paginação Inteligente",
          content: `Todas as listas suportam paginação para melhor performance. Escolha quantos itens deseja ver por página (10, 25, 50 ou 100).`,
        },
        {
          title: "Busca Global",
          content: `Use a barra de busca em qualquer lista para filtrar por nome, descrição, ou qualquer campo. A busca é instantânea e case-insensitive.`,
        },
        {
          title: "Gráficos Interativos",
          features: [
            {
              name: "Hover",
              description:
                "Passe o mouse sobre barras/setores para ver detalhes",
            },
            {
              name: "Insights",
              description: "Veja análises automáticas (TOP 3, Média, Mediana)",
            },
            {
              name: "Rankings",
              description: "Rankings completos de bairros, fiscais, empresas",
            },
          ],
        },
        {
          title: "DataTable Reutilizável",
          content: `O DataTable é um componente altamente configurável usado em todas as listas do sistema (Projetos, Bairros, Empresas, etc.). Ele oferece uma experiência completa de navegação, busca e gerenciamento de dados.`,
          features: [
            {
              name: "Busca Inteligente",
              description:
                "Filtre dados instantaneamente digitando qualquer termo. A busca funciona em todas as colunas simultaneamente.",
            },
            {
              name: "Ordenação por Colunas",
              description:
                "Clique no cabeçalho de qualquer coluna para ordenar crescente ou decrescente (↑↓).",
            },
            {
              name: "Paginação Flexível",
              description:
                "Escolha visualizar 10, 25, 50 ou 100 itens por página conforme sua preferência.",
            },
            {
              name: "Seleção Múltipla",
              description:
                "Use checkboxes para selecionar múltiplos itens e executar ações em lote.",
            },
            {
              name: "Ações Individuais",
              description:
                "Cada linha possui botões de ação: Visualizar (👁️), Editar (✏️) e Excluir (🗑️).",
            },
            {
              name: "Refresh Automático",
              description:
                "Atualize os dados a qualquer momento clicando no botão de atualizar (🔄).",
            },
            {
              name: "Responsivo",
              description:
                "A tabela se adapta perfeitamente a diferentes tamanhos de tela (desktop, tablet, mobile).",
            },
            {
              name: "Formatação Inteligente",
              description:
                "Diferentes tipos de dados são formatados automaticamente: datas, moeda (R$), status com cores.",
            },
          ],
          note: "O DataTable é usado em todo o sistema para garantir consistência e uma experiência de usuário uniforme.",
        },
      ],
    },
    {
      id: "seguranca",
      title: "Segurança",
      icon: <Lock className="w-5 h-5" />,
      color: "red",
      topics: [
        {
          title: "Autenticação Segura",
          content: `O sistema usa criptografia de nível bancário (Blowfish) para proteger senhas e JWT tokens para autenticação segura.`,
        },
        {
          title: "Proteção de Dados",
          features: [
            {
              name: "Senhas Criptografadas",
              description: "Bcrypt com salt único por usuário",
            },
            {
              name: "Tokens JWT",
              description: "Sessões seguras com expiração automática",
            },
            {
              name: "Rate Limiting",
              description: "Proteção contra tentativas de invasão",
            },
            {
              name: "Auditoria",
              description: "Todas as ações são registradas",
            },
          ],
        },
        {
          title: "Boas Práticas",
          steps: [
            "Nunca compartilhe sua senha",
            "Faça logout ao sair",
            "Use senhas fortes (mínimo 8 caracteres)",
            "Não deixe a sessão aberta em computadores públicos",
            "Reporte atividades suspeitas ao administrador",
          ],
        },
        {
          title: "Recuperação de Senha",
          steps: [
            "Entre em contato com o administrador do sistema",
            "Informe seu CPF",
            "Uma nova senha será gerada e enviada",
          ],
        },
      ],
    },
    {
      id: "dicas",
      title: "Dicas e Truques",
      icon: <Info className="w-5 h-5" />,
      color: "cyan",
      topics: [
        {
          title: "Atalhos Úteis",
          shortcuts: [
            {
              action: "Voltar",
              description: 'Use o botão "Voltar" ou navegador',
            },
            {
              action: "Busca Rápida",
              description: "Digite na barra de busca em qualquer lista",
            },
            {
              action: "Ordenação",
              description: "Clique no cabeçalho da tabela para ordenar (↑↓)",
            },
            {
              action: "Refresh",
              description:
                "Use o ícone de atualizar (🔄) para recarregar dados",
            },
          ],
        },
        {
          title: "Produtividade",
          tips: [
            "Use filtros de status no Dashboard para focar em projetos específicos",
            "Marque todas as notificações como lidas periodicamente",
            "Use a busca global para encontrar projetos rapidamente",
            "Configure a paginação para ver mais itens de uma vez",
            "Clique diretamente nos gráficos para navegar",
          ],
        },
        {
          title: "Resolução de Problemas",
          problems: [
            {
              problem: "Não consigo ver um projeto",
              solution:
                "Verifique se você tem permissão e se o projeto não está filtrado",
            },
            {
              problem: "Dados não atualizam",
              solution: 'Clique no botão "Atualizar" ou recarregue a página',
            },
            {
              problem: "Upload falhou",
              solution: "Verifique o tamanho do arquivo e formato suportado",
            },
            {
              problem: "Não consigo editar",
              solution: "Apenas ADMIN pode editar. Verifique suas permissões",
            },
          ],
        },
      ],
    },
  ];

  // Filtrar seções por busca
  const filteredSections = sections.filter((section) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      section.title.toLowerCase().includes(searchLower) ||
      section.topics.some(
        (topic) =>
          topic.title?.toLowerCase().includes(searchLower) ||
          topic.content?.toLowerCase().includes(searchLower)
      )
    );
  });

  // Cores por seção
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      hover: "hover:bg-blue-100",
      active: "bg-blue-100",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      hover: "hover:bg-indigo-100",
      active: "bg-indigo-100",
      iconBg: "bg-indigo-100",
      iconText: "text-indigo-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      hover: "hover:bg-green-100",
      active: "bg-green-100",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      hover: "hover:bg-purple-100",
      active: "bg-purple-100",
      iconBg: "bg-purple-100",
      iconText: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      hover: "hover:bg-orange-100",
      active: "bg-orange-100",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      hover: "hover:bg-red-100",
      active: "bg-red-100",
      iconBg: "bg-red-100",
      iconText: "text-red-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      hover: "hover:bg-yellow-100",
      active: "bg-yellow-100",
      iconBg: "bg-yellow-100",
      iconText: "text-yellow-600",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      hover: "hover:bg-amber-100",
      active: "bg-amber-100",
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-700",
      hover: "hover:bg-teal-100",
      active: "bg-teal-100",
      iconBg: "bg-teal-100",
      iconText: "text-teal-600",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-700",
      hover: "hover:bg-cyan-100",
      active: "bg-cyan-100",
      iconBg: "bg-cyan-100",
      iconText: "text-cyan-600",
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      hover: "hover:bg-slate-100",
      active: "bg-slate-100",
      iconBg: "bg-slate-100",
      iconText: "text-slate-600",
    },
  };

  const activeContent = sections.find((s) => s.id === activeSection);
  const colors = colorClasses[activeContent?.color] || colorClasses.blue;

  return (
    <BasePage pageTitle="">
      <BaseContent
        pageTitle="Central de Ajuda"
        onBack={() => navigate(-1)}
        breadcrumbs={[{ label: "Central de Ajuda" }]}
      >
        <div className="min-h-screen">
          {/* Header com busca */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Central de Ajuda</h1>
                <p className="text-blue-100 mt-1">
                  Guia completo do Sistema de Gestão de Projetos
                </p>
              </div>
            </div>

            {/* Busca */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                placeholder="Buscar na documentação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar com seções */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                  Seções
                </h3>
                <nav className="space-y-1">
                  {filteredSections.map((section) => {
                    const sectionColors = colorClasses[section.color];
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? `${sectionColors.bg} ${sectionColors.border} border ${sectionColors.text}`
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div
                          className={`${
                            isActive ? sectionColors.iconBg : "bg-gray-100"
                          } ${
                            isActive ? sectionColors.iconText : "text-gray-500"
                          } p-1.5 rounded-lg`}
                        >
                          {section.icon}
                        </div>
                        <span className="text-sm font-medium flex-1 text-left">
                          {section.title}
                        </span>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                {activeContent && (
                  <div className="space-y-8">
                    {/* Título da seção */}
                    <div
                      className={`${colors.bg} ${colors.border} border rounded-xl p-6`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${colors.iconBg} p-3 rounded-xl`}>
                          <div className={colors.iconText}>
                            {activeContent.icon}
                          </div>
                        </div>
                        <div>
                          <h2 className={`text-2xl font-bold ${colors.text}`}>
                            {activeContent.title}
                          </h2>
                          <p className="text-gray-600 text-sm mt-1">
                            {activeContent.topics.length} tópico(s) disponível
                            (is)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tópicos */}
                    {activeContent.topics.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className="border-l-4 pl-6 py-2"
                        style={{
                          borderColor: colorClasses[
                            activeContent.color
                          ].iconText.replace("text-", ""),
                        }}
                      >
                        {/* Título do tópico */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle
                            className={`w-5 h-5 ${colors.iconText}`}
                          />
                          {topic.title}
                        </h3>

                        {/* Conteúdo */}
                        {topic.content && (
                          <p className="text-gray-700 leading-relaxed mb-4 bg-gray-50 p-4 rounded-lg">
                            {topic.content}
                          </p>
                        )}

                        {/* Steps */}
                        {topic.steps && (
                          <div className="space-y-2 mb-4">
                            {topic.steps.map((step, stepIndex) => (
                              <div
                                key={stepIndex}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div
                                  className={`${colors.iconBg} ${colors.iconText} w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5`}
                                >
                                  {stepIndex + 1}
                                </div>
                                <p className="text-gray-700 text-sm flex-1">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Items/Features */}
                        {topic.items && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {topic.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                              >
                                <div className="font-semibold text-gray-900 mb-1">
                                  {item.type ||
                                    item.role ||
                                    item.name ||
                                    item.format}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {item.description || item.permissions}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Features */}
                        {topic.features && (
                          <div className="space-y-2 mb-4">
                            {topic.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <CheckCircle
                                  className={`w-5 h-5 ${colors.iconText} flex-shrink-0 mt-0.5`}
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {feature.name}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Fields */}
                        {topic.fields && (
                          <div className="overflow-x-auto mb-4">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                                    Campo
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                                    Descrição
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                                    Obrigatório
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {topic.fields.map((field, fieldIndex) => (
                                  <tr key={fieldIndex}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                      {field.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {field.description}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {field.required ? (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                          Sim
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                          Não
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Examples */}
                        {topic.examples && (
                          <div
                            className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-4`}
                          >
                            <div
                              className={`text-sm font-medium ${colors.text} mb-2`}
                            >
                              Exemplos:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {topic.examples.map((example, exIndex) => (
                                <span
                                  key={exIndex}
                                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                                >
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Shortcuts */}
                        {topic.shortcuts && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {topic.shortcuts.map((shortcut, sIndex) => (
                              <div
                                key={sIndex}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                              >
                                <div className="font-semibold text-gray-900 text-sm">
                                  {shortcut.action}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {shortcut.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tips */}
                        {topic.tips && (
                          <div className="space-y-2 mb-4">
                            {topic.tips.map((tip, tipIndex) => (
                              <div
                                key={tipIndex}
                                className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700">{tip}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Problems/Solutions */}
                        {topic.problems && (
                          <div className="space-y-3 mb-4">
                            {topic.problems.map((prob, probIndex) => (
                              <div
                                key={probIndex}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="font-semibold text-gray-900 mb-2">
                                  ❓ {prob.problem}
                                </div>
                                <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                                  ✅ {prob.solution}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Note */}
                        {topic.note && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-800">
                                <span className="font-semibold">Nota:</span>{" "}
                                {topic.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Warning */}
                        {topic.warning && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-yellow-800">
                                <span className="font-semibold">Atenção:</span>{" "}
                                {topic.warning}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer de ajuda */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Precisa de mais ajuda?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Contate o Administrador
                      </div>
                      <p className="text-gray-600 mt-1">
                        Entre em contato com o admin do sistema para suporte
                        técnico
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Documentação Técnica
                      </div>
                      <p className="text-gray-600 mt-1">
                        Acesse a documentação completa da API em /docs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseContent>
    </BasePage>
  );
}
