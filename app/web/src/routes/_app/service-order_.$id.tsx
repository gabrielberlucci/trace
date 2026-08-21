import ServiceOrderViewPage from '@/pages/service-order-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/service-order_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ServiceOrderViewPage />;
}
