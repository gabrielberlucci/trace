import SalesCreatePage from '@/pages/sale-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/sale-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SalesCreatePage />;
}
