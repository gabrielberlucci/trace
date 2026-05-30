import UsersCreatePage from '@/pages/users-create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/user-create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersCreatePage />;
}
