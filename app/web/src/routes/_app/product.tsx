import ProductsPage from '@/pages/products';
import { createFileRoute } from '@tanstack/react-router';

type ProductSearch = {
  page: number;
}

export const Route = createFileRoute('/_app/product')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductsPage />;
}
