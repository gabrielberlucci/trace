import PaymentViewPage from '@/pages/payment-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/payment_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PaymentViewPage />;
}
