import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getKardex } from '@/api/kardex/get-kardex';
import type { PaginatedKardexData } from '@/types/kardex-type';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const kardexColumns: ColumnDef<PaginatedKardexData>[] = [
  {
    accessorKey: 'movementId',
    header: 'ID Mov.',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground tracking-wide">
        {row.original.movementId}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <span className="text-sm font-medium text-foreground tracking-wide">
          {date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR')}
        </span>
      );
    },
  },
  {
    accessorKey: 'typeMovement',
    header: 'Tipo',
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-foreground tracking-wide">
          {row.original.typeMovement}
        </span>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: () => <div className="text-right">Qtd</div>,
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const isOut = quantity < 0;

      return (
        <div className="text-right">
          <span
            className={`text-sm font-semibold tracking-wide tabular-nums ${
              isOut ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {isOut ? '-' : '+'}
            {Math.abs(quantity)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'numNf',
    header: 'NF-e',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.original.numNf || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'serieNf',
    header: 'Série',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.original.serieNf || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'saleId',
    header: 'Cód Venda',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground tracking-wide">
        {row.original.saleId || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Acumulado</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <span className="text-sm font-bold tracking-wide tabular-nums text-violet-600">
            {row.original.total}
          </span>
        </div>
      );
    },
  },
];

const KardexPage = () => {
  const { page, codbarra } = useSearch({ from: '/_app/kardex' });
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const [localSearch, setLocalSearch] = useState(codbarra ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (codbarra ?? '')) {
        navigate({
          to: '/kardex',
          search: {
            page: 1,
            codbarra: localSearch || undefined,
          },
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, navigate, codbarra]);

  const { isFetching, error, data } = useQuery({
    queryKey: ['kardex', page, codbarra],
    queryFn: () => getKardex(page, codbarra),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      toast.success(data.message);
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching kardex:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/kardex', search: { page: page - 1, codbarra } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/kardex', search: { page: page + 1, codbarra } });
    }
  };

  const totalPages = data?.meta?.totalPages || 1;

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
            navigate({ to: '/kardex', search: { page: i, codbarra } })
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
            Kardex
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o histórico de movimentações do seu inventário.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={kardexColumns}
          data={data?.data || []}
          searchPlaceholder="Buscar por código de barras..."
          showPagination={false}
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
        />

        {/* Paginação Servidor/URL */}
        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page} de {totalPages} ({data.meta.total}{' '}
              movimentações no total)
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

export default KardexPage;
