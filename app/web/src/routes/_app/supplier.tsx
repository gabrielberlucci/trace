import SuppliersPage from '@/pages/suppliers';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/supplier')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SuppliersPage />;
}
