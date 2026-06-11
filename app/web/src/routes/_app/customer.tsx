import CustomerPage from '@/pages/customers';
import { createFileRoute } from '@tanstack/react-router';

type CustomerSearch = {
  page: number;
  q?: string;
  active?: string;
}

export const Route = createFileRoute('/_app/customer')({
  validateSearch: (search: Record<string, unknown>): CustomerSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
      active: typeof search?.active === 'string' ? search.active : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerPage />;
}
