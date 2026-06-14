import React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  MoreVertical,
  CreditCard,
  Banknote,
  QrCode,
  Filter,
  Edit,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

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
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link to="/sale/$id" params={{ id: row.getValue('id') as string }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-violet-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

const SalesPage = () => {
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
    <>
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
                <Link to="/sale-create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Nova Venda
                </Link>
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
          </>
  );
};

export default SalesPage;
