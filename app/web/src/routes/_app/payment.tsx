import PaymentsPage from '@/pages/payments';
import { createFileRoute } from '@tanstack/react-router';

type PaymentSearch = {
  page: number;
  q?: string;
  active?: string;
}

export const Route = createFileRoute('/_app/payment')({
  validateSearch: (search: Record<string, unknown>): PaymentSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
      active: typeof search?.active === 'string' ? search.active : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <PaymentsPage />;
}
