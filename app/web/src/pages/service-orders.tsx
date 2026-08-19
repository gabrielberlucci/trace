import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getServiceOrders } from '@/api';
import type { ServiceOrderData } from '@/types';
import { useEffect, useState } from 'react';

const columns: ColumnDef<ServiceOrderData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <span className="text-sm font-medium text-foreground">
          {date.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'customer.document',
    header: 'Documento do Cliente',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.original.customer?.document || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'customer.name',
    header: 'Nome do Cliente',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.original.customer?.name || 'N/A'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link to="/service-order/$id" params={{ id: row.getValue('id') as string }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-violet-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

const ServiceOrdersPage = () => {
  const { page, q } = useSearch({ from: '/_app/service-orders' });
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(q ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (q ?? '')) {
        navigate({
          to: '/service-orders',
          search: {
            page: 1,
            q: localSearch || undefined,
          },
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, navigate, q]);

  const { isFetching, data } = useQuery({
    queryKey: ['service-orders', page, q],
    queryFn: () => getServiceOrders(page, q),
    placeholderData: keepPreviousData,
  });

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/service-orders', search: { page: page - 1, q } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/service-orders', search: { page: page + 1, q } });
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
          onClick={() =>
            navigate({ to: '/service-orders', search: { page: i, q } })
          }
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
            Ordens de Serviço
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Gerencie e visualize as ordens de serviço.
          </p>
        </div>
        <Link to="/service-orders-create">
          <Button className="bg-violet-600 hover:bg-violet-700">
            Nova Ordem
          </Button>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchPlaceholder="Buscar por Documento do Cliente..."
          exportFileName="ordens-de-servico.csv"
          showPagination={false}
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
        />

        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page} de {data.meta.totalPages} (
              {data.meta.total} registros no total)
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

export default ServiceOrdersPage;
