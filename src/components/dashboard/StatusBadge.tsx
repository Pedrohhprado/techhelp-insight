import { Badge } from '@/components/ui/badge';
import { TicketStatus, TicketPriority, TicketSatisfaction } from '@/types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
}

interface PriorityBadgeProps {
  priority: TicketPriority;
}

interface SatisfactionBadgeProps {
  satisfaction: TicketSatisfaction;
}

const statusStyles = {
  'Aberto': 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  'Pendente': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'Em Andamento': 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  'Resolvido': 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  'Fechado': 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
};

const priorityStyles = {
  'Baixa': 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted',
  'Média': 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  'Alta': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'Urgente': 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
};

const satisfactionStyles = {
  'Regular': 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  'Médio': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'Bom': 'bg-success/10 text-success border-success/20 hover:bg-success/20',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={`font-medium ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge variant="outline" className={`font-medium ${priorityStyles[priority]}`}>
      {priority}
    </Badge>
  );
}

export function SatisfactionBadge({ satisfaction }: SatisfactionBadgeProps) {
  return (
    <Badge variant="outline" className={`font-medium ${satisfactionStyles[satisfaction]}`}>
      {satisfaction}
    </Badge>
  );
}
