import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCustomers } from '@/api';
import type { PaginatedCustomerData } from '@/types/customer-type';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const columns: ColumnDef<PaginatedCustomerData>[] = [
  {
    accessorKey: 'id',
    header: 'ID do Cliente',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground">
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
    accessorKey: 'document',
    header: 'Documento',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('document')}
      </span>
    ),
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.getValue('active') as boolean;
      return (
        <div className="flex items-center gap-2 text-sm font-medium">
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

const CustomerPage = () => {
  const { page } = useSearch({ from: '/_app/customer' });
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  const { isFetching, error, data } = useQuery({
    queryKey: ['customers', page],
    queryFn: () => getCustomers(page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      toast.success(data.message);
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching customers:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/customer', search: { page: page - 1 } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/customer', search: { page: page + 1 } });
    }
  };

  const renderPageNumbers = () => {
    if (!data?.meta) return null;
    const { totalPages } = data.meta;
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
          onClick={() => navigate({ to: '/customer', search: { page: i } })}
        >
          {i}
        </Button>,
      );
    }

    return <div className="flex items-center gap-1 mx-2">{pages}</div>;
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Clientes
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Gerencie e cadastre seus clientes.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
          <Link to="/customer-create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Novo Cliente
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchPlaceholder="Buscar clientes por nome..."
          exportFileName="clientes.csv"
          filterColumn="name"
          showPagination={false}
        />

        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page} de {data.meta.totalPages} (
              {data.meta.totalCustomers} clientes no total)
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

export default CustomerPage;
