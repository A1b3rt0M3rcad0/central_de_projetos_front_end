# 📊 Visualização da EAP em Árvore Hierárquica

## 🎯 Funcionalidade Implementada

Foi criada uma nova página de visualização da EAP (Estrutura Analítica do Projeto) que apresenta a estrutura em formato de árvore hierárquica, similar ao exemplo da imagem fornecida.

## 🚀 Como Acessar

### Via Navegação Direta

- URL: `/project/{id}/eap/tree-view`
- Acessível através do botão "Visualizar Árvore" na página principal da EAP

### Via Página EAP Principal

1. Acesse a página da EAP do projeto: `/project/{id}/eap`
2. Clique no botão "Visualizar Árvore" no header da página

## 🎨 Características Visuais

### Cores por Nível (baseado na imagem)

- **Nível 1 (Fases)**: Teal escuro (#006064) - Retângulos principais
- **Nível 2 (Entregas)**: Teal claro (#80deea) - Primeira decomposição
- **Nível 3 (Atividades)**: Teal muito claro (#b2ebf2) - Segunda decomposição
- **Nível 4 (Tarefas)**: Teal super claro (#e0f7fa) - Terceira decomposição

### Layout Hierárquico

- **Códigos WBS**: Numeração hierárquica (1.0, 1.1, 1.1.1, etc.)
- **Conexões**: Linhas pretas conectando níveis pai e filhos
- **Estrutura**: Layout horizontal com expansão vertical

## 🛠️ Funcionalidades

### Navegação e Zoom

- **Zoom In/Out**: Botões +/- ou scroll do mouse
- **Pan**: Arrastar com o mouse para navegar
- **Reset**: Botão para voltar à visualização inicial
- **Fit to Screen**: Ajustar automaticamente ao tamanho da tela

### Exportação

- **PNG**: Exporta a árvore como imagem PNG
- **PDF**: Exporta a árvore como documento PDF com:
  - Título da EAP
  - Data de geração
  - Imagem da árvore
  - Informações adicionais

### Estatísticas

- **Progresso Geral**: Percentual de conclusão
- **Orçamento Total**: Soma de todos os itens
- **Estrutura**: Contagem por tipo (fases, entregas, atividades, tarefas)
- **Status**: Distribuição por status (concluído, em andamento, não iniciado)

## 📁 Arquivos Criados

### Componentes

- `src/components/ui/EAPTreeDiagram.jsx` - Componente principal da árvore
- `src/pages/projects/EAPTreeViewPage.jsx` - Página de visualização

### Rotas

- Adicionada rota: `ROUTES.PROJECTS.EAP_TREE_VIEW`
- Integrada com o sistema de navegação existente

### Dependências

- `jspdf` - Para exportação em PDF
- `html2canvas` - Para captura de canvas (instalado mas não usado ainda)

## 🎯 Uso Prático

### Para Vereadores

- Visualização clara da estrutura do projeto
- Acompanhamento do progresso hierárquico
- Exportação para apresentações e relatórios

### Para Fiscais

- Compreensão da estrutura de trabalho
- Identificação de dependências entre atividades
- Acompanhamento visual do progresso

### Para Administradores

- Visão completa da organização do projeto
- Ferramenta para apresentações executivas
- Documentação visual da EAP

## 🔧 Configurações Técnicas

### Canvas

- Renderização em HTML5 Canvas
- Suporte a zoom e pan
- Resolução adaptável ao dispositivo

### Responsividade

- Layout adaptável a diferentes tamanhos de tela
- Controles de navegação otimizados
- Modo tela cheia disponível

### Performance

- Renderização otimizada para estruturas grandes
- Lazy loading de elementos visuais
- Cache de posicionamentos

## 📊 Exemplo de Uso

```javascript
// Navegação programática
navigate(`/project/${projectId}/eap/tree-view`);

// Acesso via constante
navigate(ROUTES.PROJECTS.EAP_TREE_VIEW.replace(":id", projectId));
```

## 🎨 Personalização

### Cores

As cores podem ser personalizadas no objeto `NODE_CONFIG.colors` do componente `EAPTreeDiagram.jsx`.

### Tamanhos

Dimensões dos nós e espaçamentos podem ser ajustados no objeto `NODE_CONFIG.spacing`.

### Fontes

Configurações de fonte disponíveis no objeto `NODE_CONFIG.font`.

## 🚀 Próximas Melhorias

- [ ] Drag & Drop para reorganizar itens
- [ ] Edição inline de propriedades
- [ ] Filtros por tipo ou status
- [ ] Animações de transição
- [ ] Modo de apresentação (slides)
- [ ] Integração com cronograma (Gantt)

---

**Versão**: 1.0.0  
**Data**: Janeiro 2025  
**Compatibilidade**: React 19, Vite, Tailwind CSS
