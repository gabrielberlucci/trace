import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPaginatedStockAdjustments } from '@/api';
import type { StockAdjustmentPaginatedItem } from '@/types';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const columns: ColumnDef<StockAdjustmentPaginatedItem>[] = [
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
    header: 'Data e Hora',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formattedDate = date.toLocaleDateString('pt-BR');
      const formattedTime = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return (
        <span className="text-sm font-medium text-foreground">
          {`${formattedDate} às ${formattedTime}`}
        </span>
      );
    },
  },
  {
    accessorKey: 'product.barcode',
    header: 'Código de Barras',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.original.product?.barcode || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'product.description',
    header: 'Produto',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground max-w-[200px] truncate block">
        {row.original.product?.description || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'typeMovement',
    header: 'Operação',
    cell: ({ row }) => {
      const typeMovement = row.getValue('typeMovement') as string;
      const isEntrada = typeMovement === 'AJUSTE_ENTRADA';

      return (
        <span
          className={cn(
            'text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap',
            isEntrada
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-red-500/10 text-red-600',
          )}
        >
          {isEntrada ? 'Entrada' : 'Saída'}
        </span>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantidade',
    cell: ({ row }) => {
      const qty = row.getValue('quantity') as number;
      const typeMovement = row.original.typeMovement;
      const isEntrada = typeMovement === 'AJUSTE_ENTRADA';

      return (
        <span
          className={cn(
            'text-sm font-bold',
            isEntrada ? 'text-emerald-600' : 'text-red-600',
          )}
        >
          {isEntrada ? '+' : ''}
          {qty}
        </span>
      );
    },
  },
];

const StockAdjustmentsPage = () => {
  const { page, barcode } = useSearch({ from: '/_app/stock-adjustments' });
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(barcode ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (barcode ?? '')) {
        navigate({
          to: '/stock-adjustments',
          search: {
            page: 1,
            barcode: localSearch || undefined,
          },
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, navigate, barcode]);

  const toastShownRef = useRef(false);

  const { isFetching, error, data } = useQuery({
    queryKey: ['stock-adjustments', page, barcode],
    queryFn: () => getPaginatedStockAdjustments(page, barcode),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      // Avoid showing toast purely for data fetch unless needed.
      // Usually, it's better to show it on actions, but since it's patterned like service-orders:
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching stock adjustments:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({
        to: '/stock-adjustments',
        search: { page: page - 1, barcode },
      });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({
        to: '/stock-adjustments',
        search: { page: page + 1, barcode },
      });
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
            navigate({
              to: '/stock-adjustments',
              search: { page: i, barcode },
            })
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
            Ajustes de Estoque
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Visualize o histórico de entradas e saídas manuais do estoque.
          </p>
        </div>
        <Link to="/stock-adjustment-create">
          <Button className="bg-violet-600 hover:bg-violet-700">
            Novo Ajuste
          </Button>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchPlaceholder="Filtrar por código de barras..."
          exportFileName="ajustes-estoque.csv"
          showPagination={false}
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
        />

        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page} de {data.meta.totalPages} (
              {data.meta.totalSales} registros no total)
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

export default StockAdjustmentsPage;
