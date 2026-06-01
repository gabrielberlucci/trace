import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export type PaymentMethod = {
  id: string;
  name: string;
  provider: string;
  type: string;
  status: 'Ativo' | 'Inativo';
};

const data: PaymentMethod[] = [
  {
    id: 'pay_cc_01',
    name: 'Credit Card',
    provider: 'Stripe',
    type: 'Cartão de Crédito',
    status: 'Ativo',
  },
  {
    id: 'pay_pix_02',
    name: 'PIX',
    provider: 'Banco Central',
    type: 'Transferência Instantânea',
    status: 'Ativo',
  },
  {
    id: 'pay_bol_03',
    name: 'Boleto Bancário',
    provider: 'Pagar.me',
    type: 'Boleto',
    status: 'Inativo',
  },
  {
    id: 'pay_cash_04',
    name: 'Cash',
    provider: 'In-person Settlement',
    type: 'Dinheiro Físico',
    status: 'Ativo',
  },
];

const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Método',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('name')}
      </span>
    ),
  },
  {
    accessorKey: 'provider',
    header: 'Provedor / Integração',
    cell: ({ row }) => (
      <span className="text-sm text-foreground/80">
        {row.getValue('provider')}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue('type')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <div
            className={`w-2 h-2 rounded-full ${
              status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {status}
        </div>
      );
    },
  },
];

const PaymentsPage = () => {
  return (
    <>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Payment Methods
                </h1>
                <p className="text-muted-foreground">
                  Manage and configure available gateways for transactions.
                </p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
                <Link to="/payment-create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Novo Método
                </Link>
              </Button>
            </div>

            <div className="mt-6">
              <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Buscar métodos de pagamento..."
                exportFileName="pagamentos.csv"
                filterColumn="status"
              />
            </div>
          </>
  );
};

export default PaymentsPage;
