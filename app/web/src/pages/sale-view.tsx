import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getSingleSale } from '@/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Building2,
  User,
  CreditCard,
  Barcode,
  Package,
  DollarSign,
  UserCheck,
  Printer,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { PDFDownloadLink, usePDF } from '@react-pdf/renderer';
import { ReceiptPDF } from '@/components/receipt-pdf';

const InfoItem = ({
  label,
  value,
  icon: Icon,
  colSpan = 1,
}: {
  label: string;
  value?: string | number | null;
  icon?: any;
  colSpan?: number;
}) => (
  <div
    className={`flex flex-col space-y-1.5 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}
  >
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-violet-500" />}
      {label}
    </Label>
    <p className="font-medium text-foreground text-sm">
      {value !== undefined && value !== null && value !== '' ? (
        value
      ) : (
        <span className="text-muted-foreground/70 italic">Não informado</span>
      )}
    </p>
  </div>
);

const PrintButton = ({ sale, saleId }: { sale: any; saleId: string | number }) => {
  const [instance] = usePDF({ document: <ReceiptPDF sale={sale} saleId={saleId} /> });
  
  return (
    <Button
      variant="outline"
      className="gap-2 border-violet-500/30 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
      disabled={instance.loading || !!instance.error}
      onClick={() => {
        if (instance.url) {
          window.open(instance.url, '_blank');
        }
      }}
    >
      {instance.loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
      {instance.loading ? 'Gerando...' : 'Imprimir'}
    </Button>
  );
};

const SaleViewPage = () => {
  const { id } = useParams({ from: '/_app/sale_/$id' });
  const navigate = useNavigate();

  const {
    data: response,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['sale', id],
    queryFn: () => getSingleSale(Number(id)),
  });

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-destructive">
        <p>Ocorreu um erro ao carregar os dados da venda.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/sale' })}>
          Voltar para Vendas
        </Button>
      </div>
    );
  }

  const { data: sale } = response;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/sale' })}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Detalhes da Venda
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualizando informações da venda #{id}
            </p>
          </div>
        </div>

        <PrintButton sale={sale} saleId={id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Gerais */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-500" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <InfoItem
                label="Data da Venda"
                value={formatDate(sale.date)}
                icon={Calendar}
              />
              <InfoItem
                label="Vendedor (Usuário)"
                value={sale.user?.name}
                icon={UserCheck}
              />
              <InfoItem
                label="Forma de Pagamento"
                value={sale.paymentMethod?.description}
                icon={CreditCard}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-violet-500" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <InfoItem
                label="Nome"
                value={sale.customer?.name}
                icon={User}
              />
              <InfoItem
                label="Documento"
                value={sale.customer?.document}
              />
              <InfoItem
                label="E-mail"
                value={sale.customer?.email}
              />
              <InfoItem
                label="Telefone"
                value={sale.customer?.phone}
              />
              <InfoItem
                label="Endereço"
                value={
                  sale.customer?.address
                    ? `${sale.customer.address}, ${sale.customer.addressNumber || 'S/N'}${
                        sale.customer.complement
                          ? ` - ${sale.customer.complement}`
                          : ''
                      }${
                        sale.customer.neighborhood
                          ? ` - ${sale.customer.neighborhood}`
                          : ''
                      }`
                    : null
                }
              />
              {sale.customer?.city && (
                <InfoItem
                  label="Cidade"
                  value={`${sale.customer.city.name} - ${sale.customer.city.state}`}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empresa */}
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-violet-500" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoItem
                label="Nome Fantasia"
                value={sale.company?.fantasyName}
                icon={Building2}
              />
              <InfoItem
                label="CNPJ"
                value={sale.company?.document}
              />
              <InfoItem
                label="E-mail"
                value={sale.company?.email}
              />
              <InfoItem
                label="Telefone"
                value={sale.company?.phone}
              />
              <InfoItem
                label="Endereço"
                value={
                  sale.company?.address
                    ? `${sale.company.address}, ${sale.company.addressNumber || 'S/N'}${sale.company.complement ? ` - ${sale.company.complement}` : ''}`
                    : null
                }
                colSpan={2}
              />
              <InfoItem
                label="Bairro"
                value={sale.company?.neighborhood}
              />
              {sale.company?.city && (
                <InfoItem
                  label="Cidade"
                  value={`${sale.company.city.name} - ${sale.company.city.state}`}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Itens da Venda */}
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-500" />
              Itens da Venda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Código de Barras</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-center">Quantidade</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Preço Unitário</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {sale.saleItem?.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-2">
                        <Barcode className="h-4 w-4 text-muted-foreground" />
                        {item.barcode}
                      </td>
                      <td className="px-6 py-4 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">
                        {formatCurrency(item.salePrice)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-violet-600">
                        {formatCurrency(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                  {(!sale.saleItem || sale.saleItem.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground italic">
                        Nenhum item encontrado para esta venda.
                      </td>
                    </tr>
                  )}
                </tbody>
                {sale.saleItem && sale.saleItem.length > 0 && (
                  <tfoot className="bg-muted/30 font-semibold border-t-2 border-border/50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right uppercase text-xs tracking-wider">
                        Total da Venda:
                      </td>
                      <td className="px-6 py-4 text-right text-lg text-violet-600">
                        {formatCurrency(
                          sale.saleItem.reduce(
                            (acc: number, item: any) => acc + Number(item.totalPrice),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaleViewPage;
