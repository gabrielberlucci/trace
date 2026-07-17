import SupplierViewPage from '@/pages/supplier-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/supplier_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SupplierViewPage />;
}
