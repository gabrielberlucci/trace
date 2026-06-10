import SuppliersPage from '@/pages/suppliers';
import { createFileRoute } from '@tanstack/react-router';

type SupplierSearch = {
  page: number;
}

export const Route = createFileRoute('/_app/supplier')({
  validateSearch: (search: Record<string, unknown>): SupplierSearch => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SuppliersPage />;
}
