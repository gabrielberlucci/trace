import ProductsPage from '@/pages/products';
import { createFileRoute } from '@tanstack/react-router';

type ProductSearch = {
  page: number;
  q?: string;
  active?: string;
}

export const Route = createFileRoute('/_app/product')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
      active: typeof search?.active === 'string' ? search.active : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductsPage />;
}
