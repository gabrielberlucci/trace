import UsersPage from '@/pages/users';
import { createFileRoute } from '@tanstack/react-router';

type UserSearch = {
  page: number;
  q?: string;
  active?: string;
}

export const Route = createFileRoute('/_app/user')({
  validateSearch: (search: Record<string, unknown>): UserSearch => {
    return {
      page: Number(search?.page ?? 1),
      q: typeof search?.q === 'string' ? search.q : undefined,
      active: typeof search?.active === 'string' ? search.active : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersPage />;
}
