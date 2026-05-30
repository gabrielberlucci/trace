import CustomerPage from '@/pages/customers';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerPage />;
}
