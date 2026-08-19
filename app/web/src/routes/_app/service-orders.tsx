import ServiceOrdersPage from '@/pages/service-orders';
import { createFileRoute } from '@tanstack/react-router';

type ServiceOrdersSearch = {
  page: number;
  q?: string;
};

export const Route = createFileRoute('/_app/service-orders')({
  validateSearch: (search: Record<string, unknown>): ServiceOrdersSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <ServiceOrdersPage />;
}
