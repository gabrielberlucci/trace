import ProductsCreatePage from '@/pages/products-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/product-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductsCreatePage />;
}
