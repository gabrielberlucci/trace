import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, MoreVertical, Filter } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSuppliers } from '@/api';
import type { PaginatedSuppliersData } from '@/types';

const suppliersColumns: ColumnDef<PaginatedSuppliersData>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-foreground">
          {row.original.name}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5 font-mono">
          ID: {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'cnpj',
    header: 'CNPJ',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground tracking-wide">
        {row.getValue('cnpj')}
      </span>
    ),
  },

  {
    id: 'actions',
    header: 'Ações',
    cell: () => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const SuppliersPage = () => {
  const { isFetching, error, data } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => getSuppliers(),
    placeholderData: keepPreviousData,
  });

  console.log(data);

  const toolbarActions = (
    <>
      <Button
        variant="default"
        className="bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 rounded-full h-9 px-5 text-[13px] font-semibold border-none"
      >
        Todos
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 text-muted-foreground border-zinc-200 dark:border-zinc-800 ml-1 hover:bg-muted"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuLabel>Filtrar Categoria</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Tecnologia
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Logística</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Infraestrutura</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Fornecedores
          </h1>
          <p className="text-muted-foreground">
            Gerencie os fornecedores de produtos e serviços do sistema Trace.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
          <Link to="/supplier-create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Adicionar Fornecedor
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <DataTable
          columns={suppliersColumns}
          data={data?.data || []}
          searchPlaceholder="Buscar fornecedores..."
          toolbarActions={toolbarActions}
        />
      </div>
    </>
  );
};

export default SuppliersPage;
