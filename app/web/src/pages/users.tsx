import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getUsers } from '@/api';
import { useState, useEffect } from 'react';
import type { UserItem } from '@/types';

const usersColumns: ColumnDef<UserItem>[] = [
  {
    accessorKey: 'id',
    header: 'id',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground/80">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Usuário',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              {row.getValue('name')}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: 'role',
    header: 'cargo',
    cell: ({ row }) => {
      const role = row.getValue('role') as { name: string };
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground capitalize">
              {role?.name || 'N/A'}
            </span>
          </div>
        </div>
      );
    },
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

const UsersPage = () => {
  const { page = 1, q, active } = useSearch({ from: '/_app/user' });
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(q ?? '');
  const [localActive, setLocalActive] = useState(active ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (q ?? '') || localActive !== (active ?? '')) {
        navigate({
          to: '/user',
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
    queryKey: ['users', page, q, active],
    queryFn: () => getUsers(page, q, active),
    placeholderData: keepPreviousData,
  });

  if (error) {
    console.error('Error fetching users:', error);
  }

  const handlePreviousPage = () => {
    if (data?.meta?.hasPrevious) {
      navigate({ to: '/user', search: { page: page - 1, q, active } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta?.hasNext) {
      navigate({ to: '/user', search: { page: page + 1, q, active } });
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
            navigate({ to: '/user', search: { page: i, q, active } })
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
            Usuários
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Gerencie o acesso e as permissões da sua equipe no sistema.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
          <Link to="/user-create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Adicionar Usuário
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <DataTable
          columns={usersColumns}
          data={data?.data?.userData || []}
          searchPlaceholder="Buscar por nome ou e-mail..."
          exportFileName="usuarios.csv"
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
              {data.meta.totalUsers} usuários no total)
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

export default UsersPage;
