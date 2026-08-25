import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Download,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/users/me';
import { getDashboard } from '@/api/dashboard/get-dashboard';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DashboardPage = () => {
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe });

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { startDate, endDate } = useMemo(() => {
    return {
      startDate: date?.from
        ? format(date.from, 'yyyy-MM-dd')
        : format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: date?.to
        ? format(date.to, 'yyyy-MM-dd')
        : date?.from
          ? format(date.from, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
    };
  }, [date]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', startDate, endDate],
    queryFn: () => getDashboard({ startDate, endDate }),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const userName = user?.name || user?.username || 'Usuário';

  const handleExport = () => {
    if (!dashboardData) return;

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'; // \uFEFF to support UTF-8 BOM in Excel
    csvContent += 'Métrica,Valor\n';
    csvContent += `Ticket Médio de Vendas,${dashboardData.avgTicket || 0}\n`;
    csvContent += `Total de Vendas,${dashboardData.totalSaleIncome || 0}\n`;
    csvContent += `Total de OS,${dashboardData.totalOSIncome || 0}\n\n`;

    csvContent += 'Produtos Mais Vendidos\n';
    csvContent += 'Código de Barras,Descrição,Estoque,Vendidos\n';

    dashboardData.highestSalesProducts?.forEach((product) => {
      const desc = product.description.replace(/"/g, '""'); // escape double quotes for CSV
      csvContent += `${product.barcode},"${desc}",${product.currentStock},${product.sales}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dashboard_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Bem-vindo de volta,{' '}
            <span className="font-semibold text-violet-500">{userName}</span>.
            Aqui está o resumo do seu negócio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-sm text-muted-foreground bg-card border-border/50 shadow-sm font-normal"
              >
                <Calendar className="w-4 h-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "d 'de' MMM, yyyy", { locale: ptBR })}{' '}
                      - {format(date.to, "d 'de' MMM, yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(date.from, "d 'de' MMM, yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleExport}
            disabled={!dashboardData}
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">
            Carregando dados do dashboard...
          </p>
        </div>
      ) : (
        <>
          {/* KPIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Ticket Médio de Vendas
                  </p>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(dashboardData?.avgTicket || 0)}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total de Vendas
                  </p>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(dashboardData?.totalSaleIncome || 0)}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total de OS
                  </p>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(dashboardData?.totalOSIncome || 0)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Products */}
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-col border-b border-border/50 pb-4">
              <CardTitle className="text-base font-medium">
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription className="text-xs">
                Produtos vendidos com estoque crítico (abaixo de 10)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {dashboardData?.highestSalesProducts?.length === 0 && (
                  <div className="p-5 text-center text-muted-foreground text-sm">
                    Nenhum produto encontrado.
                  </div>
                )}
                {dashboardData?.highestSalesProducts?.map((product, index) => (
                  <div
                    key={product.barcode || index}
                    className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center shadow-sm">
                        <Package className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {product.description}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Código de Barras: {product.barcode} • Estoque:{' '}
                          <span className="text-red-500 font-medium">
                            {product.currentStock}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-violet-500 mb-0.5">
                        {product.sales} Vendidos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
