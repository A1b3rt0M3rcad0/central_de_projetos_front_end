# StatusBadge Component

Um componente reutilizável para exibir badges de status com formatação moderna e consistente.

## Características

- **Design Moderno**: Gradientes suaves, bordas arredondadas e sombras sutis
- **Ícones Intuitivos**: Emojis que representam visualmente cada status
- **Cores Semânticas**: Cada status tem uma cor específica que facilita a identificação
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Texto com contraste adequado e tooltips

## Status Suportados

| Status | Cor | Ícone | Descrição |
|--------|-----|-------|-----------|
| Aguardando | Laranja | ⏳ | Projetos aguardando recursos |
| Em Andamento | Azul | 🔄 | Projetos em execução |
| Concluído | Verde | ✅ | Projetos finalizados |
| Cancelado | Vermelho | ❌ | Projetos cancelados |
| Pausado | Amarelo | ⏸️ | Projetos temporariamente pausados |
| Outros | Cinza | ❓ | Status não reconhecido |

## Uso

```jsx
import StatusBadge from './components/ui/StatusBadge';

// Uso básico
<StatusBadge status="Aguardando Verba" />

// Com tamanho personalizado
<StatusBadge status="Em Andamento" size="lg" />

// Sem ícone
<StatusBadge status="Concluído" showIcon={false} />
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `status` | string | - | Texto do status a ser exibido |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Tamanho do badge |
| `showIcon` | boolean | true | Se deve exibir o ícone |

## Tamanhos

- **sm**: Pequeno (px-2 py-1, text-xs)
- **md**: Médio (px-3 py-1.5, text-xs) - Padrão
- **lg**: Grande (px-4 py-2, text-sm)

## Implementação

O componente detecta automaticamente o tipo de status baseado no texto e aplica a formatação apropriada. Para adicionar novos status, basta atualizar a função `getStatusConfig` no componente.

## Integração

O StatusBadge é usado em:
- Lista de projetos (`ProjectListContent`)
- Detalhes do projeto (`ProjectContent`)
- Exemplo do DataTable (`DataTableExample`)
- Componente DataTable genérico (`DataTable`) 