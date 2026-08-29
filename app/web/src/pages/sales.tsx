import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Edit, CreditCard, Banknote, QrCode } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getSales } from '@/api';
import type { PaginatedSalesData } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { pdf } from '@react-pdf/renderer';
import { ReceiptPDF } from '@/components/receipt-pdf';
import { getSingleSale } from '@/api';
import { Printer } from 'lucide-react';

const PrintAction = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const response = await getSingleSale(id);
      if (response && response.data) {
        const blob = await pdf(<ReceiptPDF sale={response.data} saleId={id} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        toast.error('Erro ao buscar dados da venda.');
      }
    } catch (error) {
      toast.error('Erro ao gerar PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-violet-600 transition-colors"
      onClick={handlePrint}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
    </Button>
  );
};

export const columns: ColumnDef<PaginatedSalesData>[] = [
  {
    accessorKey: 'id',
    header: 'ID Venda',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground">
        #{row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formattedDate = date.toLocaleDateString('pt-BR');
      const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return (
        <span className="text-sm font-medium text-foreground">
          {`${formattedDate} às ${formattedTime}`}
        </span>
      );
    },
  },
  {
    id: 'customer',
    accessorFn: (row) => row.customer.name,
    header: 'Cliente',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.original.customer.name}
      </span>
    ),
  },
  {
    id: 'paymentMethod',
    accessorFn: (row) => row.paymentMethod.description,
    header: 'Pagamento',
    cell: ({ row }) => {
      // Basic logic to pick an icon based on name or fallback
      const desc = row.original.paymentMethod.description.toLowerCase();
      let Icon = Banknote;
      if (desc.includes('cartão') || desc.includes('credito') || desc.includes('debito')) Icon = CreditCard;
      if (desc.includes('pix')) Icon = QrCode;

      return (
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {row.original.paymentMethod.description}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Link to="/sale/$id" params={{ id: String(row.getValue('id')) }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-violet-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <PrintAction id={Number(row.getValue('id'))} />
      </div>
    ),
  },
];

const SalesPage = () => {
  const { page, q } = useSearch({ from: '/_app/sale' });
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const [localSearch, setLocalSearch] = useState(q ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (q ?? '')) {
        navigate({
          to: '/sale',
          search: {
            page: 1,
            q: localSearch || undefined,
          },
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, navigate, q]);

  const { isFetching, error, data } = useQuery({
    queryKey: ['sales', page, q],
    queryFn: () => getSales(page || 1, q || ''),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      toast.success(data.message);
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching sales:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/sale', search: { page: (page || 1) - 1, q } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/sale', search: { page: (page || 1) + 1, q } });
    }
  };

  const renderPageNumbers = () => {
    if (!data?.meta) return null;
    const { totalPages } = data.meta;
    const pages = [];
    const currentPage = page || 1;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          disabled={i === currentPage}
          className={`w-9 ${
            i === currentPage
              ? 'bg-violet-600 text-white border-transparent disabled:opacity-100 disabled:cursor-default'
              : ''
          }`}
          onClick={() => navigate({ to: '/sale', search: { page: i, q } })}
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
            Vendas
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
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
          columns={columns}
          data={data?.data || []}
          searchPlaceholder="Buscar por documento do cliente..."
          exportFileName="vendas.csv"
          showPagination={false}
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
        />

        {data && data.meta && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Mostrando página {page || 1} de {data.meta.totalPages} (
              {data.meta.totalSales} vendas no total)
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

export default SalesPage;
