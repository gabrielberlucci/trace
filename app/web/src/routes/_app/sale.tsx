import SalesPage from '@/pages/sales';
import { createFileRoute } from '@tanstack/react-router';

type SaleSearch = {
  page: number;
  q?: string;
};

export const Route = createFileRoute('/_app/sale')({
  validateSearch: (search: Record<string, unknown>): SaleSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SalesPage />;
}
