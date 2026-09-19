import KardexPage from '@/pages/kardex';
import { createFileRoute } from '@tanstack/react-router';

type KardexSearch = {
  page: number;
  codbarra?: string;
};

export const Route = createFileRoute('/_app/kardex')({
  validateSearch: (search: Record<string, unknown>): KardexSearch => {
    return {
      page: Number(search?.page ?? 1),
      codbarra:
        typeof search?.codbarra === 'string' ? search.codbarra : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <KardexPage />;
}
