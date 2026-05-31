import ProductsPage from '@/pages/products';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/product')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductsPage />;
}
