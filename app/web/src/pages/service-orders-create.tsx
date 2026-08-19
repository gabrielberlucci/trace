import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import {
  UserPlus,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  CalendarIcon,
  Trash2,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getCustomers, createServiceOrder } from '@/api';
import type { PaginatedCustomerData } from '@/types';
import { useNavigate, Link } from '@tanstack/react-router';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceOrderSchema } from '@app/shared';
import { z } from 'zod';
import { isAxiosError } from 'axios';

type ServiceOrderFormInput = z.infer<typeof serviceOrderSchema>;

const ServiceOrdersCreatePage = () => {
  const navigate = useNavigate();

  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [customers, setCustomers] = useState<PaginatedCustomerData[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<PaginatedCustomerData | null>(null);

  const form = useForm<ServiceOrderFormInput>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
      date: new Date().toISOString(),
      document: '',
      items: [
        {
          date: new Date().toISOString(),
          description: '',
          hours: 1,
          hourlyRate: 0,
        },
      ],
    },
  });

  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');

  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerSearch.length < 2) {
        if (!customerSearch) setCustomers([]);
        return;
      }
      try {
        const res = await getCustomers(1, customerSearch, 'Ativo');
        if (res?.data) {
          setCustomers(res.data);
        }
      } catch (e) {
        setCustomers([]);
      }
    };
    const timer = setTimeout(fetchCustomers, 600);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const onSubmit = async (data: ServiceOrderFormInput) => {
    try {
      if (!selectedCustomer) {
        toast.error('Selecione um cliente válido.');
        return;
      }

      await createServiceOrder(data);
      toast.success('Ordem de Serviço criada com sucesso!');
      navigate({ to: '/service-orders', search: { page: 1 } as never });
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const errData = error.response.data;
        if (errData.fieldErrors) {
          Object.entries(errData.fieldErrors).forEach(([field, messages]) => {
            toast.error(`${field}: ${(messages as string[]).join(', ')}`);
          });
        } else if (errData.formErrors && errData.formErrors.length > 0) {
          errData.formErrors.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(errData.message || 'Erro ao criar a Ordem de Serviço');
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro desconhecido.');
      }
    }
  };

  const calculateTotal = () => {
    return watchItems.reduce((acc, item) => acc + (Number(item.hours) || 0) * (Number(item.hourlyRate) || 0), 0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/service-orders">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Nova Ordem de Serviço
            </h1>
            <p className="text-muted-foreground text-sm">
              Crie uma nova OS vinculando o cliente e os serviços realizados.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg">Informações Principais</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Data de Emissão da OS</Label>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                              errors.date && 'border-red-500 focus-visible:ring-red-500'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), 'PPP', { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 dark:[color-scheme:dark]" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(d) => d && field.onChange(d.toISOString())}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label>Cliente</Label>
                  <Popover open={customerDropdownOpen} onOpenChange={setCustomerDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant={selectedCustomer ? 'default' : 'outline'}
                        className={cn(
                          'w-full justify-start gap-2 shadow-sm font-medium transition-all',
                          selectedCustomer
                            ? 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600'
                            : 'bg-card border-border/50 hover:bg-muted/50',
                        )}
                      >
                        <UserPlus className="w-4 h-4" />
                        {selectedCustomer
                          ? `${selectedCustomer.name} - ${selectedCustomer.document}`
                          : 'Selecionar Cliente...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="p-2 border-b border-border/50 bg-muted/20">
                        <Input
                          placeholder="Buscar cliente (CPF/CNPJ ou Nome)..."
                          className="h-9 bg-background text-xs border-border/50"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="p-1 max-h-[300px] overflow-y-auto">
                        {customers.length === 0 && customerSearch.length > 1 ? (
                          <div className="p-3 text-xs text-center text-muted-foreground">
                            Nenhum cliente encontrado.
                          </div>
                        ) : (
                          customers.map((customer) => (
                            <div
                              key={customer.id}
                              className="px-3 py-2 text-sm hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setValue('document', customer.document);
                                setCustomerDropdownOpen(false);
                                setCustomerSearch('');
                              }}
                            >
                              <p className="font-semibold text-foreground">
                                {customer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Doc: {customer.document}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {errors.document && !selectedCustomer && (
                    <p className="text-xs text-red-500">{errors.document.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Itens do Serviço</CardTitle>
                <CardDescription>Adicione os serviços prestados nesta ordem.</CardDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => append({ date: new Date().toISOString(), description: '', hours: 1, hourlyRate: 0 })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Adicionar Item
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {errors.items?.root && (
                <p className="text-sm text-red-500 mb-4">{errors.items.root.message}</p>
              )}
              
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-muted/20 p-4 rounded-lg border border-border/50">
                    <div className="md:col-span-3 space-y-2">
                      <Label>Data do Item</Label>
                      <Controller
                        control={control}
                        name={`items.${index}.date`}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full justify-start text-left font-normal h-9 px-3',
                                  !field.value && 'text-muted-foreground',
                                  errors.items?.[index]?.date && 'border-red-500 focus-visible:ring-red-500'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                {field.value ? (
                                  <span className="truncate">{format(new Date(field.value), 'P', { locale: ptBR })}</span>
                                ) : (
                                  <span>Data</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 dark:[color-scheme:dark]" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(d) => d && field.onChange(d.toISOString())}
                                locale={ptBR}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      {errors.items?.[index]?.date && <p className="text-xs text-red-500">{errors.items[index]?.date?.message}</p>}
                    </div>

                    <div className="md:col-span-4 space-y-2">
                      <Label>Descrição</Label>
                      <Input 
                        placeholder="Ex: Formatação de PC" 
                        className="h-9"
                        {...form.register(`items.${index}.description`)} 
                      />
                      {errors.items?.[index]?.description && <p className="text-xs text-red-500">{errors.items[index]?.description?.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Horas</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        min="0.1"
                        className="h-9"
                        {...form.register(`items.${index}.hours`, { valueAsNumber: true })} 
                      />
                      {errors.items?.[index]?.hours && <p className="text-xs text-red-500">{errors.items[index]?.hours?.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Valor Hora</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        className="h-9"
                        {...form.register(`items.${index}.hourlyRate`, { valueAsNumber: true })} 
                      />
                      {errors.items?.[index]?.hourlyRate && <p className="text-xs text-red-500">{errors.items[index]?.hourlyRate?.message}</p>}
                    </div>

                    <div className="md:col-span-1 space-y-2 flex flex-col justify-end h-full pb-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-sm border-border/50 sticky top-4">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg">Resumo da OS</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Itens Totais</span>
                  <span>{fields.length}</span>
                </div>
                {selectedCustomer && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cliente</span>
                    <span className="font-medium text-foreground truncate max-w-[150px]">{selectedCustomer.name}</span>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-violet-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(calculateTotal())}
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleSubmit(onSubmit)} 
                disabled={isSubmitting}
                className="w-full mt-6 bg-violet-600 hover:bg-violet-700 h-12 text-md"
              >
                {isSubmitting ? 'Finalizando...' : 'Finalizar OS'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrdersCreatePage;
