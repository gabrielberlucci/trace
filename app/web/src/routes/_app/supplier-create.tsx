import SuppliersCreatePage from '@/pages/suppliers-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/supplier-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SuppliersCreatePage />;
}
