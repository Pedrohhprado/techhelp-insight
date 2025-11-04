import { useState, useMemo } from 'react';
import { mockTickets } from '@/data/mockTickets';
import { Ticket } from '@/types/ticket';
import { KPICard } from '@/components/dashboard/KPICard';
import { TicketsTable } from '@/components/dashboard/TicketsTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Headset, 
  TicketCheck, 
  Clock, 
  Timer, 
  ThumbsUp,
  Users,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

const COLORS = {
  primary: 'hsl(221 83% 53%)',
  secondary: 'hsl(262 83% 58%)',
  success: 'hsl(142 71% 45%)',
  warning: 'hsl(38 92% 50%)',
  destructive: 'hsl(0 84% 60%)',
  accent: 'hsl(142 76% 36%)',
  muted: 'hsl(220 9% 46%)',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.destructive,
  '#FF6B9D',
  '#00D9FF',
  '#FFA07A',
  '#9370DB',
  '#20B2AA',
];

export default function Index() {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [timeFilter, setTimeFilter] = useState('all');
  const [lastUpdate] = useState(new Date());

  const filteredTickets = useMemo(() => {
    if (timeFilter === 'all') return tickets;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return tickets;
    }
    
    return tickets.filter(t => t.dataAbertura >= filterDate);
  }, [tickets, timeFilter]);

  // KPI Calculations
  const totalTickets = filteredTickets.length;
  const statusCounts = useMemo(() => {
    const counts = {
      'Aberto': 0,
      'Pendente': 0,
      'Em Andamento': 0,
      'Resolvido': 0,
      'Fechado': 0,
    };
    filteredTickets.forEach(t => counts[t.status]++);
    return counts;
  }, [filteredTickets]);

  const avgTMA = useMemo(() => {
    const sum = filteredTickets.reduce((acc, t) => acc + t.tma, 0);
    return Math.round(sum / filteredTickets.length);
  }, [filteredTickets]);

  const avgFRT = useMemo(() => {
    const sum = filteredTickets.reduce((acc, t) => acc + t.frt, 0);
    return Math.round(sum / filteredTickets.length);
  }, [filteredTickets]);

  const satisfactionRate = useMemo(() => {
    const bom = filteredTickets.filter(t => t.satisfacao === 'Bom').length;
    return Math.round((bom / filteredTickets.length) * 100);
  }, [filteredTickets]);

  // Agent Chart Data
  const agentData = useMemo(() => {
    const agentCounts: Record<string, number> = {};
    filteredTickets.forEach(t => {
      agentCounts[t.agenteResponsavel] = (agentCounts[t.agenteResponsavel] || 0) + 1;
    });
    
    return Object.entries(agentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        chamados: count,
        percentual: ((count / totalTickets) * 100).toFixed(1),
      }));
  }, [filteredTickets, totalTickets]);

  const topAgent = agentData[0];

  // Reason Chart Data
  const reasonData = useMemo(() => {
    const reasonCounts: Record<string, number> = {};
    filteredTickets.forEach(t => {
      reasonCounts[t.motivo] = (reasonCounts[t.motivo] || 0) + 1;
    });
    
    return Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        percentual: ((value / totalTickets) * 100).toFixed(1),
      }));
  }, [filteredTickets, totalTickets]);

  const topReason = reasonData[0];

  // Department Chart Data
  const departmentData = useMemo(() => {
    const deptCounts: Record<string, number> = {};
    filteredTickets.forEach(t => {
      deptCounts[t.departamento] = (deptCounts[t.departamento] || 0) + 1;
    });
    
    return Object.entries(deptCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, chamados]) => ({ name, chamados }));
  }, [filteredTickets]);

  const topDepartment = departmentData[0];

  // Priority Evolution Chart Data
  const priorityEvolutionData = useMemo(() => {
    const monthlyData: Record<string, Record<string, number>> = {};
    
    filteredTickets.forEach(t => {
      const monthYear = t.dataAbertura.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { Baixa: 0, Média: 0, Alta: 0, Urgente: 0 };
      }
      monthlyData[monthYear][t.prioridade]++;
    });
    
    return Object.entries(monthlyData)
      .map(([month, priorities]) => ({
        month,
        ...priorities,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        return new Date(`${aMonth} 20${aYear}`).getTime() - new Date(`${bMonth} 20${bYear}`).getTime();
      })
      .slice(-6);
  }, [filteredTickets]);

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8 px-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Headset className="h-8 w-8" />
            <h1 className="text-3xl font-bold">TechHelp Solutions</h1>
          </div>
          <p className="text-primary-foreground/90">Dashboard de Suporte Técnico</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-primary-foreground/80">
            <Calendar className="h-4 w-4" />
            <span>Última atualização: {lastUpdate.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar Dados
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <KPICard
            title="Total de Chamados"
            value={totalTickets}
            icon={TicketCheck}
            variant="primary"
            subtitle="Todos os chamados"
          />
          <KPICard
            title="Em Aberto"
            value={statusCounts['Aberto']}
            icon={TicketCheck}
            variant="danger"
            subtitle={`${statusCounts['Pendente']} pendentes`}
          />
          <KPICard
            title="Em Andamento"
            value={statusCounts['Em Andamento']}
            icon={TrendingUp}
            variant="primary"
          />
          <KPICard
            title="TMA Médio"
            value={formatMinutes(avgTMA)}
            icon={Clock}
            variant="default"
            subtitle={`FRT: ${formatMinutes(avgFRT)}`}
          />
          <KPICard
            title="Satisfação"
            value={`${satisfactionRate}%`}
            icon={ThumbsUp}
            variant="success"
            subtitle="Avaliações boas"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Agent Chart */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Chamados por Agente Responsável</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value, name) => [value, 'Chamados']}
                />
                <Bar dataKey="chamados" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
              📊 <strong>{topAgent?.name}</strong> é o agente mais produtivo com <strong>{topAgent?.chamados} chamados</strong> atendidos, representando <strong>{topAgent?.percentual}%</strong> do total
            </p>
          </Card>

          {/* Reason Pie Chart */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <h3 className="text-xl font-bold">Distribuição por Motivo</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reasonData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentual }) => `${name}: ${percentual}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
              📊 <strong>{topReason?.name}</strong> é o problema mais recorrente, representando <strong>{topReason?.percentual}%</strong> dos chamados (<strong>{topReason?.value} casos</strong>)
            </p>
          </Card>

          {/* Department Chart */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="text-xl font-bold">Chamados por Departamento</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="chamados" fill={COLORS.success} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
              📊 O departamento de <strong>{topDepartment?.name}</strong> registrou mais chamados com <strong>{topDepartment?.chamados} solicitações</strong>
            </p>
          </Card>

          {/* Priority Evolution Chart */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Timer className="h-5 w-5 text-warning" />
              <h3 className="text-xl font-bold">Evolução por Prioridade</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priorityEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Area type="monotone" dataKey="Baixa" stackId="1" stroke={COLORS.muted} fill={COLORS.muted} />
                <Area type="monotone" dataKey="Média" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} />
                <Area type="monotone" dataKey="Alta" stackId="1" stroke={COLORS.warning} fill={COLORS.warning} />
                <Area type="monotone" dataKey="Urgente" stackId="1" stroke={COLORS.destructive} fill={COLORS.destructive} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
              📊 Análise temporal mostra distribuição equilibrada entre prioridades ao longo dos meses
            </p>
          </Card>
        </div>

        {/* Tickets Table */}
        <TicketsTable tickets={filteredTickets} />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground py-6 border-t">
          <p>Dashboard desenvolvido com React + TypeScript • Última atualização: {lastUpdate.toLocaleString('pt-BR')}</p>
        </footer>
      </div>
    </div>
  );
}
