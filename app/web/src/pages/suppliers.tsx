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
import { Plus, MoreVertical, Filter, Mail, Phone } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export type Supplier = {
  company: string;
  id: string;
  cnpj: string;
  email: string;
  phone: string;
  category: string;
};

const suppliersData: Supplier[] = [
  {
    company: 'TechSupply Informática Ltda',
    id: 'FOR-1042',
    cnpj: '12.345.678/0001-90',
    email: 'contato@techsupply.com.br',
    phone: '(11) 3456-7890',
    category: 'Tecnologia',
  },
  {
    company: 'Global Logistics Brasil',
    id: 'FOR-0891',
    cnpj: '98.765.432/0001-10',
    email: 'atendimento@globallog.br',
    phone: '(21) 9876-5432',
    category: 'Logística',
  },
  {
    company: 'Móveis Office Design SA',
    id: 'FOR-2204',
    cnpj: '45.678.901/0002-33',
    email: 'vendas@officedesign.com',
    phone: '(41) 3222-1100',
    category: 'Infraestrutura',
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Tecnologia':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400';
    case 'Logística':
      return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

const getCategoryDotColor = (category: string) => {
  switch (category) {
    case 'Tecnologia':
      return 'bg-violet-500';
    case 'Logística':
      return 'bg-teal-500';
    default:
      return 'bg-slate-500';
  }
};

const suppliersColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'company',
    header: 'Company Name',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-foreground">
          {row.original.company}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5 font-mono">
          ID: {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'cnpj',
    header: 'CNPJ',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground tracking-wide">
        {row.getValue('cnpj')}
      </span>
    ),
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" /> {row.original.email}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" /> {row.original.phone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const cat = row.getValue('category') as string;
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(cat)}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${getCategoryDotColor(cat)}`}
          ></span>
          {cat}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
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

const SuppliersPage = () => {
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Fornecedores
                </h1>
                <p className="text-muted-foreground">
                  Gerencie os fornecedores de produtos e serviços do sistema
                  Trace.
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
                data={suppliersData}
                searchPlaceholder="Buscar fornecedores..."
                toolbarActions={toolbarActions}
              />
            </div>
          </>
  );
};

export default SuppliersPage;
