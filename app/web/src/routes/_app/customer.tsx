import CustomerPage from '@/pages/customers';
import { createFileRoute } from '@tanstack/react-router';

type CustomerSearch = {
  page: number;
}

export const Route = createFileRoute('/_app/customer')({
  validateSearch: (search: Record<string, unknown>): CustomerSearch => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerPage />;
}
