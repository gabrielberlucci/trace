import UserViewPage from '@/pages/user-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/user_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserViewPage />;
}
