import SalesPage from '@/pages/sales';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/sale')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SalesPage />;
}
