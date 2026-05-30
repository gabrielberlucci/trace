import CustomersCreatePage from '@/pages/customers-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomersCreatePage />;
}
