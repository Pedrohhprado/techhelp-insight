import { Ticket, TicketStatus, TicketPriority, TicketSatisfaction, Department, TicketReason } from '@/types/ticket';

const solicitantes = [
  'Kaique Cavalcante', 'Luigi Moraes', 'Dra. Ágatha Maria Souza', 'Elisa Camargo',
  'Luna Peixoto', 'Sr. Caio Cavalcante', 'Agatha Otto', 'Nicole Carvalho',
  'Maya Silva', 'Yasmin Cavalcante', 'Brenda Vargas', 'Brenda Jesus',
  'Sra. Antonella Ryan Peixoto', 'Rhavi Lima', 'Yasmin Barros', 'Pedro Alves',
  'Sofia Martins', 'Lucas Souza', 'Mariana Costa', 'Felipe Santos'
];

const agentes = [
  'Maria Clara Gonçalves', 'João Silva', 'Ana Sophia Sousa', 'Luara da Conceição',
  'Yago Ferreira', 'Flor Ferreira', 'Vinícius Câmara', 'Luara Moura',
  'Maria Cecília Rocha', 'Rosa Brito', 'Guilherme Silva', 'Maysa Porto',
  'Felipe Gomes', 'Maria Cavalcante', 'Gael Henrique Cardoso'
];

const motivos: TicketReason[] = [
  'Acesso Negado', 'Falha de Software', 'Hardware Defeituoso',
  'Problema de Conexão com a Internet', 'Impressora Não Funciona',
  'Erro de Login', 'Lentidão do Sistema', 'Instalação de Software',
  'Configuração de E-mail', 'Backup de Dados'
];

const departamentos: Department[] = [
  'Vendas', 'Marketing', 'Financeiro', 'Produção', 'Recursos Humanos', 'TI'
];

const solucoes = [
  'Substituição de componente, teste de memória e diagnóstico',
  'Reinstalação do software, atualização de drivers e verificação',
  'Reset de senha e verificação de credenciais',
  'Configuração de rede e teste de conectividade',
  'Troca de cartuchos e limpeza de cabeçote',
  'Otimização de sistema e limpeza de cache',
  'Instalação e configuração completa',
  'Configuração de servidor SMTP e testes',
  'Backup realizado e verificado com sucesso'
];

const statusDistribution: TicketStatus[] = [
  'Fechado', 'Fechado', 'Fechado',
  'Resolvido', 'Resolvido', 'Resolvido',
  'Em Andamento', 'Em Andamento',
  'Pendente', 'Pendente',
  'Aberto'
];

const prioridadeDistribution: TicketPriority[] = [
  'Baixa', 'Baixa', 'Média', 'Média', 'Média', 'Alta', 'Alta', 'Urgente'
];

const satisfacaoDistribution: TicketSatisfaction[] = [
  'Bom', 'Bom', 'Bom', 'Bom',
  'Médio', 'Médio', 'Médio',
  'Regular', 'Regular'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockTickets(count: number = 85): Ticket[] {
  const tickets: Ticket[] = [];
  const startDate = new Date('2023-10-01');
  const endDate = new Date('2025-10-31');

  for (let i = 1; i <= count; i++) {
    const status = getRandomItem(statusDistribution);
    const dataAbertura = getRandomDate(startDate, endDate);
    const hasClosed = status === 'Resolvido' || status === 'Fechado';
    
    let dataFechamento: Date | undefined;
    if (hasClosed) {
      const daysToClose = Math.floor(Math.random() * 15) + 1;
      dataFechamento = new Date(dataAbertura);
      dataFechamento.setDate(dataFechamento.getDate() + daysToClose);
    }

    const motivo = getRandomItem(motivos);
    const tma = Math.floor(Math.random() * 465) + 15; // 15-480 minutos
    const frt = Math.floor(Math.random() * 119) + 1; // 1-120 minutos

    tickets.push({
      id: `CHAMADO-${String(i).padStart(5, '0')}`,
      dataAbertura,
      dataFechamento,
      status,
      prioridade: getRandomItem(prioridadeDistribution),
      motivo,
      solucao: hasClosed ? getRandomItem(solucoes) : undefined,
      solicitante: getRandomItem(solicitantes),
      agenteResponsavel: getRandomItem(agentes),
      departamento: getRandomItem(departamentos),
      tma,
      frt,
      satisfacao: getRandomItem(satisfacaoDistribution)
    });
  }

  return tickets.sort((a, b) => b.dataAbertura.getTime() - a.dataAbertura.getTime());
}

export const mockTickets = generateMockTickets();
