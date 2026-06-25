import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPaymentMethodSchema, PaymentType } from '@app/shared';
import { createPaymentMethod } from '@/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

type FormInput = z.input<typeof createPaymentMethodSchema>;
type FormOutput = z.infer<typeof createPaymentMethodSchema>;

const PaymentsCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(createPaymentMethodSchema),
    defaultValues: {
      type: PaymentType.PIX,
    },
  });

  const onSubmit = async (data: FormOutput) => {
    try {
      setIsSubmitting(true);
      await createPaymentMethod(data);
      toast.success('Método de pagamento criado com sucesso!');
      navigate({ to: '/payment', search: { page: 1 } as never });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar método de pagamento');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseNumber = (v: string) => {
    if (v === '') return undefined;
    const num = Number(v.replace(',', '.'));
    return isNaN(num) ? undefined : num;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Nova Forma de Pagamento
            </h1>
            <p className="text-muted-foreground">
              Configure os detalhes de um novo método de pagamento para o PDV.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-semibold shadow-sm px-6 h-11 rounded-lg"
              asChild
            >
              <Link to="/payment" search={{ q: undefined, page: 1 }}>
                Cancelar
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Configuração
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="max-w-3xl space-y-8">
        {/* Informações Gerais */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
          <div className="h-1 bg-linear-to-r from-violet-500 to-cyan-400 w-full" />
          <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2.5">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                <CreditCard className="h-5 w-5" />
              </div>
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-foreground"
              >
                Nome do Método <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Ex: Cartão de Crédito Visa/Master"
                className="h-11 rounded-lg"
              />
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="type"
                  className="text-sm font-semibold text-foreground"
                >
                  Tipo de Pagamento <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="type" className="h-11 rounded-lg">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PaymentType.PIX}>PIX</SelectItem>
                        <SelectItem value={PaymentType.CREDITO}>
                          Crédito
                        </SelectItem>
                        <SelectItem value={PaymentType.DEBITO}>
                          Débito
                        </SelectItem>
                        <SelectItem value={PaymentType.POS}>
                          Maquininha (POS)
                        </SelectItem>
                        <SelectItem value={PaymentType.TEF}>
                          Integração TEF
                        </SelectItem>
                        <SelectItem value={PaymentType.OUTRO}>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <span className="text-xs text-red-500">
                    {errors.type.message}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="fee"
                  className="text-sm font-semibold text-foreground"
                >
                  Taxa (Opcional)
                </Label>
                <Input
                  id="fee"
                  {...register('fee', {
                    setValueAs: parseNumber,
                  })}
                  placeholder="0.00"
                  className="h-11 rounded-lg"
                />
                {errors.fee && (
                  <span className="text-xs text-red-500">
                    {errors.fee.message}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default PaymentsCreatePage;
