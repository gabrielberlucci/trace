import SuppliersPage from '@/pages/suppliers';
import { createFileRoute } from '@tanstack/react-router';

type SupplierSearch = {
  page: number;
  q?: string;
  active?: string;
}

export const Route = createFileRoute('/_app/supplier')({
  validateSearch: (search: Record<string, unknown>): SupplierSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
      active: typeof search?.active === 'string' ? search.active : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SuppliersPage />;
}
