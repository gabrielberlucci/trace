import ProductViewPage from '@/pages/product-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/product_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductViewPage />;
}
