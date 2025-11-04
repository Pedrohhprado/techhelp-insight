export type TicketStatus = 'Aberto' | 'Pendente' | 'Em Andamento' | 'Resolvido' | 'Fechado';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type TicketSatisfaction = 'Regular' | 'Médio' | 'Bom';
export type Department = 'Vendas' | 'Marketing' | 'Financeiro' | 'Produção' | 'Recursos Humanos' | 'TI';
export type TicketReason = 
  | 'Acesso Negado'
  | 'Falha de Software'
  | 'Hardware Defeituoso'
  | 'Problema de Conexão com a Internet'
  | 'Impressora Não Funciona'
  | 'Erro de Login'
  | 'Lentidão do Sistema'
  | 'Instalação de Software'
  | 'Configuração de E-mail'
  | 'Backup de Dados';

export interface Ticket {
  id: string;
  dataAbertura: Date;
  dataFechamento?: Date;
  status: TicketStatus;
  prioridade: TicketPriority;
  motivo: TicketReason;
  solucao?: string;
  solicitante: string;
  agenteResponsavel: string;
  departamento: Department;
  tma: number; // em minutos
  frt: number; // em minutos
  satisfacao: TicketSatisfaction;
}
