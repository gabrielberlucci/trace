import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Bell,
  Plus,
  MoreVertical,
  CreditCard,
  Banknote,
  QrCode,
  Filter,
} from 'lucide-react';

export type Sale = {
  id: string;
  date: string;
  client: string;
  items: string;
  paymentMethod: string;
  paymentIcon: React.ElementType;
  total: string;
};

const salesData: Sale[] = [
  {
    id: '#1024',
    date: '22 Out,\n14:30',
    client: 'João Silva',
    items: '4 itens (MacBook Pro...)',
    paymentMethod: 'Cartão',
    paymentIcon: CreditCard,
    total: '$4,950.00',
  },
  {
    id: '#1023',
    date: '22 Out,\n11:15',
    client: 'Maria Oliveira',
    items: '1 item (AirPods Max)',
    paymentMethod: 'Dinheiro',
    paymentIcon: Banknote,
    total: '$549.00',
  },
  {
    id: '#1022',
    date: '21 Out,\n17:45',
    client: 'Consumidor Final',
    items: '2 itens (Cabos)',
    paymentMethod: 'Pix',
    paymentIcon: QrCode,
    total: '$258.00',
  },
];

const salesColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'id',
    header: 'ID Venda',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => (
      <span className="text-sm whitespace-pre-line text-foreground/80">
        {row.getValue('date')}
      </span>
    ),
  },
  {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('client')}
      </span>
    ),
  },
  {
    accessorKey: 'items',
    header: 'Itens',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue('items')}
      </span>
    ),
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Pagamento',
    cell: ({ row }) => {
      const Icon = row.original.paymentIcon;
      return (
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {row.getValue('paymentMethod')}
        </div>
      );
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => (
      <span className="font-bold text-sm text-foreground">
        {row.getValue('total')}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const SalesFixture = () => {
  const salesToolbarActions = (
    <>
      <Button
        variant="default"
        className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-9 px-5 text-[13px] font-medium shadow-sm"
      >
        Hoje
      </Button>
      <Button
        variant="outline"
        className="rounded-full h-9 px-5 text-[13px] font-medium text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:bg-muted"
      >
        Últimos 7 dias
      </Button>
      <Button
        variant="outline"
        className="rounded-full h-9 px-5 text-[13px] font-medium text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:bg-muted"
      >
        Este Mês
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-9 w-9 text-muted-foreground border-zinc-200 dark:border-zinc-800 ml-1 hover:bg-muted"
      >
        <Filter className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-muted/40">
          <header className="flex h-14 items-center justify-between border-b bg-background px-6 lg:h-15">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border" />
              <h1 className="font-bold text-sm tracking-wider text-muted-foreground">
                TRACE ERP
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-8 space-y-6 mx-auto w-full">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Vendas
                </h1>
                <p className="text-muted-foreground">
                  Gerencie e acompanhe o histórico de vendas realizadas.
                </p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
                <Plus className="h-4 w-4" /> Nova Venda
              </Button>
            </div>

            <div className="mt-6">
              <DataTable
                columns={salesColumns}
                data={salesData}
                searchPlaceholder="Buscar por ID, cliente ou SKU..."
                toolbarActions={salesToolbarActions}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default SalesFixture;
