import UploadXmlPage from '@/pages/upload-xml';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().catch(1),
  q: z.string().optional(),
});

export const Route = createFileRoute('/_app/upload-xml')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return <UploadXmlPage />;
}
