import { createFileRoute } from '@tanstack/react-router';
import SaleViewPage from '@/pages/sale-view';

export const Route = createFileRoute('/_app/sale_/$id')({
  component: SaleViewPage,
});
