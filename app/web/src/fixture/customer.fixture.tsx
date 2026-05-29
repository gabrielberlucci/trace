import type { ColumnDef } from '@tanstack/react-table';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DataTable } from '@/components/ui/data-table';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppHeader } from '@/components/app-header';

export type Customer = {
  id: string;
  name: string;
  status: 'Ativo' | 'Inativo';
};

const data: Customer[] = [
  { id: 'cus_3k9xj1p', name: 'Gabriel Berlucci', status: 'Ativo' },
  { id: 'cus_8s0ml4c', name: 'Tech Solutions Inc.', status: 'Ativo' },
  { id: 'cus_1p2nx8d', name: 'João Silva', status: 'Inativo' },
  { id: 'cus_5v9k2rt', name: 'Maria Oliveira', status: 'Ativo' },
  { id: 'cus_9h4bc7m', name: 'Acme Corp', status: 'Inativo' },
];

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'id',
    header: 'ID do Cliente',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('name')}
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

const CustomerFixture = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-muted/40">
          <AppHeader />

          <main className="flex-1 p-8 space-y-6 mx-auto w-full">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Clientes
                </h1>
                <p className="text-muted-foreground">
                  Gerencie e cadastre seus clientes.
                </p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
                <Plus className="h-4 w-4" /> Novo Cliente
              </Button>
            </div>

            <div className="mt-6">
              <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Buscar clientes..."
                exportFileName="clientes.csv"
                filterColumn="status"
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default CustomerFixture;
