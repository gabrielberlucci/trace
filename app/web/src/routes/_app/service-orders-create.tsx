import ServiceOrdersCreatePage from '@/pages/service-orders-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/service-orders-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ServiceOrdersCreatePage />;
}
