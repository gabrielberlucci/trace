import StockAdjustmentPage from '@/pages/stock-adjustment-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/stock-adjustment-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <StockAdjustmentPage />;
}
