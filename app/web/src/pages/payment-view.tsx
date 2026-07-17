import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSinglePaymentMethod,
  modifyPaymentMethod,
} from '@/api';
import {
  Loader2,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modifyPaymentMethodSchema, PaymentType } from '@app/shared';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isAxiosError } from 'axios';

type PaymentFormInput = z.input<typeof modifyPaymentMethodSchema>;
type PaymentFormOutput = z.output<typeof modifyPaymentMethodSchema>;

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

const PaymentViewPage = () => {
  const { id } = useParams({ from: '/_app/payment_/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: response,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['paymentMethod', id],
    queryFn: () => getSinglePaymentMethod(Number(id)),
  });

  const form = useForm<PaymentFormInput, unknown, PaymentFormOutput>({
    resolver: zodResolver(modifyPaymentMethodSchema),
    values: response?.data ? {
      description: response.data.description,
      type: response.data.type,
      fee: response.data.fee || undefined,
      active: response.data.active ? 'true' : 'false',
    } : undefined,
  });

  const { errors, dirtyFields } = form.formState;

  const mutation = useMutation({
    mutationFn: (data: PaymentFormOutput) =>
      modifyPaymentMethod(Number(id), data as any),
    onSuccess: () => {
      toast.success('Método de pagamento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['paymentMethod', id] });
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          Object.entries(data.fieldErrors).forEach(([field, messages]: [string, any]) => {
            form.setError(field as any, { type: 'server', message: messages[0] });
          });
          toast.error('Erro de validação, verifique os campos destacados.');
          return;
        }
        if (data.formErrors && data.formErrors.length > 0) {
          toast.error(data.formErrors[0]);
          return;
        }
      }
      toast.error(err.message || 'Erro ao atualizar método de pagamento');
    },
  });

  const onSubmit = (data: PaymentFormOutput) => {
    if (Object.keys(dirtyFields).length === 0) {
      toast.info('Nenhuma alteração foi feita.');
      setIsEditing(false);
      return;
    }

    const patchData: any = {};
    for (const key of Object.keys(dirtyFields)) {
      patchData[key] = (data as any)[key];
    }

    mutation.mutate(patchData);
  };

  const onFormError = () => {
    toast.error('Erro de validação, verifique os campos destacados.');
  };

  const parseNumber = (v: string) => {
    if (v === '') return undefined;
    const num = Number(String(v).replace(',', '.'));
    return isNaN(num) ? undefined : num;
  };

  const getInputClassName = (fieldName: keyof PaymentFormInput, baseClass: string = 'h-11 rounded-lg') =>
    cn(
      baseClass,
      errors[fieldName] && 'border-red-500 focus-visible:ring-red-500'
    );

  const renderError = (fieldName: keyof PaymentFormInput) => {
    const error = errors[fieldName];
    if (!error) return null;
    return <span className="text-red-500 text-xs mt-1 block">{error.message as string}</span>;
  };

  if (isFetching && !response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Carregando dados do método de pagamento...
        </p>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/50 p-8">
        <XCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
          Método não encontrado
        </h3>
        <p className="text-red-600/80 dark:text-red-400/80 mb-4 text-center max-w-md">
          Não foi possível carregar os dados deste método de pagamento.
        </p>
        <Button asChild variant="outline">
          <Link to="/payment" search={{ page: 1 }}>
            Voltar para a lista
          </Link>
        </Button>
      </div>
    );
  }

  const payment = response.data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-10 w-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link to="/payment" search={{ page: 1 }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {payment.description}
              {payment.active ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              ID: <span className="font-medium text-foreground">{payment.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 flex-1 sm:flex-none"
                onClick={() => {
                  form.reset();
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 flex-1 sm:flex-none"
                disabled={mutation.isPending}
                onClick={form.handleSubmit(onSubmit, onFormError)}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 w-full sm:w-auto"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
              Editar Método
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left Column - Main Forms */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-violet-500" /> Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 gap-y-6">
                    <InfoItem
                      label="Nome do Método"
                      value={payment.description}
                    />
                    <div className="grid grid-cols-2 gap-8">
                      <InfoItem
                        label="Tipo de Pagamento"
                        value={payment.type}
                      />
                      <InfoItem
                        label="Taxa"
                        value={payment.fee !== null ? `${payment.fee}%` : undefined}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-sm font-semibold">
                        Nome do Método <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="description"
                        className={getInputClassName('description')}
                        {...form.register('description')}
                      />
                      {renderError('description')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          Tipo de Pagamento <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <Select
                              value={field.value as string}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className={getInputClassName('type')}>
                                <SelectValue placeholder="Selecione um tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={PaymentType.PIX}>PIX</SelectItem>
                                <SelectItem value={PaymentType.CREDITO}>Crédito</SelectItem>
                                <SelectItem value={PaymentType.DEBITO}>Débito</SelectItem>
                                <SelectItem value={PaymentType.POS}>Maquininha (POS)</SelectItem>
                                <SelectItem value={PaymentType.TEF}>Integração TEF</SelectItem>
                                <SelectItem value={PaymentType.OUTRO}>Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {renderError('type')}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="fee" className="text-sm font-semibold">
                          Taxa (Opcional)
                        </Label>
                        <Input
                          id="fee"
                          className={getInputClassName('fee')}
                          {...form.register('fee', {
                            setValueAs: parseNumber,
                          })}
                        />
                        {renderError('fee')}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Status */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="flex flex-col space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">
                      Status do Cadastro
                    </Label>
                    <div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          payment.active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {payment.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      Status do Cadastro
                    </Label>
                    <Controller
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <Select
                          value={field.value as string}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={getInputClassName('active')}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Ativo</SelectItem>
                            <SelectItem value="false">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {renderError('active')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentViewPage;
