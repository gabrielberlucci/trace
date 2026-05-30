import PaymentsCreatePage from '@/pages/payments-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/payment-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PaymentsCreatePage />;
}
