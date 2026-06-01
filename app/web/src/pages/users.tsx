import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, MoreVertical } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Ativo' | 'Inativo';
  avatar?: string;
};

const usersData: User[] = [
  {
    id: 'usr_01',
    name: 'Gabriel Berlucci',
    email: 'gabriel@trace.com',
    role: 'Administrador',
    department: 'Diretoria',
    status: 'Ativo',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 'usr_02',
    name: 'Aline Oliveira',
    email: 'aline@trace.com',
    role: 'Gerente',
    department: 'Vendas',
    status: 'Ativo',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
  },
  {
    id: 'usr_03',
    name: 'Carlos Santos',
    email: 'carlos@trace.com',
    role: 'Operador',
    department: 'Logística',
    status: 'Ativo',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
  },
  {
    id: 'usr_04',
    name: 'Fernanda Lima',
    email: 'fernanda@trace.com',
    role: 'Analista',
    department: 'Financeiro',
    status: 'Inativo',
  },
  {
    id: 'usr_05',
    name: 'Rafael Costa',
    email: 'rafael@trace.com',
    role: 'Suporte',
    department: 'TI',
    status: 'Ativo',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
  },
];

const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'user',
    header: 'Usuário',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 font-semibold text-xs">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground/80">
        {row.getValue('role')}
      </span>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-800">
        {row.getValue('department')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <div
            className={`w-2 h-2 rounded-full ${
              status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {status}
        </div>
      );
    },
  },
  {
    id: 'actions',
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

const UsersPage = () => {
  return (
    <>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Usuários
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
                data={usersData}
                searchPlaceholder="Buscar por nome ou e-mail..."
                exportFileName="usuarios.csv"
                filterColumn="status"
              />
            </div>
          </>
  );
};

export default UsersPage;
