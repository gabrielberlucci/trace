import PaymentsPage from '@/pages/payments';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/payment')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PaymentsPage />;
}
