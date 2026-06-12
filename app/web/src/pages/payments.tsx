import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPaymentMethods } from '@/api/payment-methods/get-payment-methods';
import type { PaginatedPaymentMethodsData } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const columns: ColumnDef<PaginatedPaymentMethodsData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground tracking-wide">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.getValue('description')}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.getValue('type')}
      </span>
    ),
  },
  {
    accessorKey: 'active',
    header: 'Status',
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

const PaymentsPage = () => {
  const { page, q, active } = useSearch({ from: '/_app/payment' });
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const [localSearch, setLocalSearch] = useState(q ?? '');
  const [localActive, setLocalActive] = useState(active ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (q ?? '') || localActive !== (active ?? '')) {
        navigate({
          to: '/payment',
          search: {
            page: 1,
            q: localSearch || undefined,
            active: localActive || undefined,
          },
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, localActive, navigate, q, active]);

  const { isFetching, error, data } = useQuery({
    queryKey: ['payments', page, q, active],
    queryFn: () => getPaymentMethods(page, q, active),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      toast.success(data.message);
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching payment methods:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/payment', search: { page: page - 1, q, active } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/payment', search: { page: page + 1, q, active } });
    }
  };

  const totalPages =
    data?.meta?.totalPages || Math.ceil((data?.meta?.total || 0) / 50) || 1;

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
          onClick={() =>
            navigate({ to: '/payment', search: { page: i, q, active } })
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
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Métodos de Pagamento
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Gerencie e configure os meios de pagamento disponíveis.
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
          data={data?.data || []}
          searchPlaceholder="Buscar por descrição ou tipo..."
          exportFileName="pagamentos.csv"
          filterColumn="active"
          showPagination={false}
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
          activeFilterValue={localActive}
          onActiveFilterChange={setLocalActive}
        />

        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page} de {totalPages} ({data.meta.total} métodos
              no total)
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

export default PaymentsPage;
