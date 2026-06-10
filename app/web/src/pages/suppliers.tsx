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
import { Plus, Filter, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSuppliers } from '@/api';
import type { PaginatedSuppliersData } from '@/types';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const suppliersColumns: ColumnDef<PaginatedSuppliersData>[] = [
  {
    accessorKey: 'id',
    header: 'id',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground tracking-wide">
        {row.getValue('id')}
      </span>
    ),
  },

  {
    accessorKey: 'typePerson',
    header: 'tipo',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.getValue('typePerson')}
      </span>
    ),
  },

  {
    accessorKey: 'document',
    header: 'cnpj',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.getValue('document')}
      </span>
    ),
  },

  {
    accessorKey: 'name',
    header: 'nome',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.getValue('name')}
      </span>
    ),
  },

  {
    accessorKey: 'active',
    header: 'ativo',
    cell: ({ row }) => {
      const active = row.getValue('active') as boolean;
      return (
        <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
          <div
            className={`w-2 h-2 rounded-full ${
              active ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {active ? 'Ativo' : 'Inativo'}
        </div>
      );
    },
  },
];

const SuppliersPage = () => {
  const { page } = useSearch({ from: '/_app/supplier' });
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  const { isFetching, error, data } = useQuery({
    queryKey: ['suppliers', page],
    queryFn: () => getSuppliers(page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      toast.success(data.message);
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching suppliers:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/supplier', search: { page: page - 1 } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/supplier', search: { page: page + 1 } });
    }
  };

  const totalPages = data?.meta?.totalPages || Math.ceil((data?.meta?.totalSuppliers || 0) / 50) || 1;

  const renderPageNumbers = () => {
    if (!data?.meta) return null;
    const pages = [];

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (page <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (page >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          disabled={i === page}
          className={`w-9 ${
            i === page
              ? 'bg-violet-600 text-white border-transparent disabled:opacity-100 disabled:cursor-default'
              : ''
          }`}
          onClick={() => navigate({ to: '/supplier', search: { page: i } })}
        >
          {i}
        </Button>
      );
    }

    return <div className="flex items-center gap-1 mx-2">{pages}</div>;
  };

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Fornecedores
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
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
          showPagination={false}
        />

        {/* Paginação Servidor/URL */}
        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page} de {totalPages} (
              {data.meta.totalSuppliers} fornecedores no total)
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!data.meta.hasPrevious}
              >
                Anterior
              </Button>

              {renderPageNumbers()}

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!data.meta.hasNext}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SuppliersPage;
