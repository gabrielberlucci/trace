import StockAdjustmentsPage from '@/pages/stock-adjustments';
import { createFileRoute } from '@tanstack/react-router';

type StockAdjustmentsSearchProps = {
  page: number;
  barcode?: string;
};

export const Route = createFileRoute('/_app/stock-adjustments')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): StockAdjustmentsSearchProps => {
    return {
      page: Number(search.page) || 1,
      barcode: search.barcode as string | undefined,
    };
  },
});

function RouteComponent() {
  return <StockAdjustmentsPage />;
}
