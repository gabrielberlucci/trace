import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/payment_/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Visualizando Pagamento: {id}</h1>
    </div>
  );
}
