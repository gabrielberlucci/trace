import CustomerViewPage from '@/pages/customer-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerViewPage />;
}
