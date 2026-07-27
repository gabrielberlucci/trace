import CompanyPage from '@/pages/companies';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().catch(1),
  q: z.string().optional(),
  active: z.string().optional(),
});

export const Route = createFileRoute('/_app/company')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return <CompanyPage />;
}
