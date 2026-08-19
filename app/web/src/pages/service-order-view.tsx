import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getSingleServiceOrder } from '@/api';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  CalendarIcon,
  FileText,
  Fingerprint,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ServiceOrderPdf } from '@/components/pdf/ServiceOrderPdf';
import { Download } from 'lucide-react';

const InfoItem = ({
  label,
  value,
  icon: Icon,
  colSpan = 1,
}: {
  label: string;
  value?: string | null;
  icon?: any;
  colSpan?: number;
}) => (
  <div className={`flex flex-col space-y-1.5 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-violet-500" />}
      {label}
    </Label>
    <p className="font-medium text-foreground text-sm">
      {value || <span className="text-muted-foreground/70 italic">Não informado</span>}
    </p>
  </div>
);

const ServiceOrderViewPage = () => {
  const { id } = useParams({ from: '/_app/service-order_/$id' });

  const { data: response, isFetching, error } = useQuery({
    queryKey: ['service-order', id],
    queryFn: () => getSingleServiceOrder(Number(id)),
  });

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">Erro ao carregar a Ordem de Serviço.</p>
        <Link to="/service-orders">
          <Button variant="outline">Voltar para Ordens de Serviço</Button>
        </Link>
      </div>
    );
  }

  const { data } = response;
  const customer = data.customer;
  const company = data.company;
  const items = data.serviceOrderItems;

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/service-orders">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-violet-500" />
              Ordem de Serviço #{data.id}
            </h1>
            <p className="text-muted-foreground text-sm">
              Detalhes completos da ordem de serviço.
            </p>
          </div>
        </div>
        
        <PDFDownloadLink 
          document={<ServiceOrderPdf data={data} />} 
          fileName={`os-${data.id}.pdf`}
        >
          {/* @ts-ignore */}
          {({ loading }) => (
            <Button className="bg-violet-600 hover:bg-violet-700" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Gerando PDF...' : 'Baixar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-violet-500" />
              Dados do Cliente
            </CardTitle>
            <CardDescription>Informações do cliente vinculado a esta OS.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <InfoItem label="Nome" value={customer.name} icon={User} colSpan={2} />
              <InfoItem label="Documento" value={customer.document} icon={Fingerprint} />
              <InfoItem label="Email" value={customer.email} icon={Mail} />
              <InfoItem label="Telefone" value={customer.phone} icon={Phone} />
              
              <div className="md:col-span-2 pt-4">
                <Separator className="mb-4" />
                <h4 className="text-sm font-semibold mb-4 text-foreground/80 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-violet-500" /> Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="CEP" value={customer.zipcode} />
                  <InfoItem label="Logradouro" value={customer.address} />
                  <InfoItem label="Número" value={customer.addressNumber?.toString()} />
                  <InfoItem label="Complemento" value={customer.complement} />
                  {customer.city && (
                    <InfoItem label="Cidade/Estado" value={`${customer.city.name}`} />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-violet-500" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>Empresa prestadora do serviço.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <InfoItem label="Razão Social" value={company.name} icon={Building} colSpan={2} />
              <InfoItem label="CNPJ" value={company.document} icon={Fingerprint} />
              <InfoItem label="Inscrição Estadual" value={company.ie} icon={FileText} />
              <InfoItem label="Email" value={company.email} icon={Mail} />
              <InfoItem label="Telefone" value={company.phone} icon={Phone} />
              
              <div className="md:col-span-2 pt-4">
                <Separator className="mb-4" />
                <h4 className="text-sm font-semibold mb-4 text-foreground/80 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-violet-500" /> Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="CEP" value={company.zipcode} />
                  <InfoItem label="Logradouro" value={company.address} />
                  <InfoItem label="Número" value={company.addressNumber?.toString()} />
                  <InfoItem label="Complemento" value={company.complement} />
                  {company.city && (
                    <InfoItem label="Cidade/Estado" value={`${company.city.name}`} />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-500" />
              Itens da Ordem de Serviço
            </CardTitle>
            <CardDescription>
              Data de emissão:{' '}
              {format(new Date(data.date), "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", {
                locale: ptBR,
              })}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Data</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Descrição</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Horas</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Valor Hora</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      Nenhum item adicionado.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="p-4 align-middle whitespace-nowrap">
                        {format(new Date(item.date), 'dd/MM/yyyy')}
                      </td>
                      <td className="p-4 align-middle">{item.description}</td>
                      <td className="p-4 align-middle text-right">{item.hours}</td>
                      <td className="p-4 align-middle text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.hourlyRate)}
                      </td>
                      <td className="p-4 align-middle text-right font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.totalPrice)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {items.length > 0 && (
                <tfoot className="bg-muted/30 border-t">
                  <tr>
                    <td colSpan={4} className="p-4 text-right font-bold">Total Geral</td>
                    <td className="p-4 text-right font-bold text-violet-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(calculateTotal())}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceOrderViewPage;
