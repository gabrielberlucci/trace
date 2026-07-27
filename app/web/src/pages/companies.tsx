import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Building2 } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCompanies } from '@/api';
import type { PaginatedCompanyData } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const columns: ColumnDef<PaginatedCompanyData>[] = [
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
    accessorKey: 'name',
    header: 'Nome da Empresa',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('name')}
      </span>
    ),
  },
  {
    accessorKey: 'document',
    header: 'CNPJ',
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
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link to="/company/$id" params={{ id: row.getValue('id') as string }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-violet-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

const CompanyPage = () => {
  const { page, q, active } = useSearch({ from: '/_app/company' });
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const [localSearch, setLocalSearch] = useState(q ?? '');
  const [localActive, setLocalActive] = useState(active ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (q ?? '') || localActive !== (active ?? '')) {
        navigate({
          to: '/company',
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
    queryKey: ['companies', page, q, active],
    queryFn: () => getCompanies(page, q, active),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.message && !toastShownRef.current) {
      toast.success(data.message);
      toastShownRef.current = true;
    }
  }, [data]);

  if (error) {
    console.error('Error fetching companies:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/company', search: { page: page - 1, q, active } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/company', search: { page: page + 1, q, active } });
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
            navigate({ to: '/company', search: { page: i, q, active } })
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
            Empresas
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Gerencie as filiais ou empresas cadastradas no sistema.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchPlaceholder="Buscar por nome ou documento..."
          exportFileName="empresas.csv"
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
              Mostrando página {page} de {data.meta.totalPages} (
              {data.meta.total} empresas no total)
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

export default CompanyPage;
