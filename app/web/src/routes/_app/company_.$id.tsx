import CompanyViewPage from '@/pages/company-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/company_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompanyViewPage />;
}
