import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSingleCustomer,
  modifyCustomer,
  getStates,
  getCityByState,
} from '@/api';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  CalendarIcon,
  CheckCircle2,
  XCircle,
  FileText,
  Fingerprint,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modifyCustomerSchema } from '@app/shared';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isAxiosError } from 'axios';
import type { PaginatedCityData } from '@/types';

type CustomerFormInput = z.input<typeof modifyCustomerSchema>;
type CustomerFormOutput = z.output<typeof modifyCustomerSchema>;

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
  <div
    className={`flex flex-col space-y-1.5 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}
  >
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-violet-500" />}
      {label}
    </Label>
    <p className="font-medium text-foreground text-sm">
      {value || (
        <span className="text-muted-foreground/70 italic">Não informado</span>
      )}
    </p>
  </div>
);

const CustomerViewPage = () => {
  const { id } = useParams({ from: '/_app/customer_/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [states, setStates] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState<string>('');
  const [cities, setCities] = useState<PaginatedCityData[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);

  const {
    data: response,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getSingleCustomer(Number(id)),
  });

  const form = useForm<CustomerFormInput, unknown, CustomerFormOutput>({
    resolver: zodResolver(modifyCustomerSchema),
    values: response?.data
      ? {
          name: response?.data.name,
          fantasyName: response?.data.fantasyName || undefined,
          document: response?.data.document,
          typePerson: response?.data.typePerson,
          ie: response?.data.ie || undefined,
          email: response?.data.email || undefined,
          phone: response?.data.phone || undefined,
          zipcode: response?.data.zipcode || undefined,
          address: response?.data.address || undefined,
          neighborhood: response?.data.neighborhood || undefined,
          addressNumber: response?.data.addressNumber || undefined,
          complement: response?.data.complement || undefined,
          birthdate: response?.data.birthdate
            ? new Date(response?.data.birthdate)
            : undefined,
          cityId: response?.data.cityId || undefined,
          active: response?.data.active ? 'true' : 'false',
        }
      : undefined,
  });

  const { errors, dirtyFields } = form.formState;

  // Load states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = (await getStates()) as { data: Record<string, string> };
        if (res?.data) setStates(res.data);
      } catch (e) {
        console.error('Failed to fetch states', e);
      }
    };
    fetchStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([]);
        return;
      }
      try {
        const res = await getCityByState(1, selectedState, citySearch);
        if (res?.data) {
          setCities(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch cities', e);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCities();
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [selectedState, citySearch]);

  // Set initial form state for cities when entering edit mode
  useEffect(() => {
    if (isEditing && response?.data) {
      if (response.data.city) {
        setSelectedState(response.data.city.state || '');
        setCitySearch(response.data.city.name || '');
      }
    }
  }, [isEditing, response]);

  const mutation = useMutation({
    mutationFn: (data: CustomerFormOutput) =>
      modifyCustomer(Number(id), data as any),
    onSuccess: () => {
      toast.success('Cliente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          Object.entries(data.fieldErrors).forEach(
            ([field, messages]: [string, any]) => {
              form.setError(field as any, {
                type: 'server',
                message: messages[0],
              });
            },
          );
          toast.error('Erro de validação, verifique os campos destacados.');
          return;
        }
        if (data.formErrors && data.formErrors.length > 0) {
          toast.error(data.formErrors[0]);
          return;
        }
      }
      toast.error(err.message || 'Erro ao atualizar cliente');
    },
  });

  const onSubmit = (data: CustomerFormOutput) => {
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

  if (isFetching && !response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Carregando dados do cliente...
        </p>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/50 p-8">
        <XCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
          Cliente não encontrado
        </h3>
        <p className="text-red-600/80 dark:text-red-400/80 mb-4 text-center max-w-md">
          Não foi possível carregar os dados deste cliente.
        </p>
        <Button asChild variant="outline">
          <Link to="/customer" search={{ page: 1 }}>
            Voltar para a lista
          </Link>
        </Button>
      </div>
    );
  }

  const customer = response.data;
  const initials = customer.name
    ? customer.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CL';

  const getInputClassName = (
    fieldName: keyof CustomerFormInput,
    baseClass: string = 'h-11 rounded-lg',
  ) =>
    cn(
      baseClass,
      errors[fieldName] && 'border-red-500 focus-visible:ring-red-500',
    );

  const renderError = (fieldName: keyof CustomerFormInput) => {
    const error = errors[fieldName];
    if (!error) return null;
    return (
      <span className="text-red-500 text-xs mt-1 block">
        {error.message as string}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          to="/customer"
          search={{ page: 1 }}
          className="hover:text-violet-600 font-medium transition-colors"
        >
          Clientes
        </Link>
        <span>›</span>
        <span className="text-foreground font-semibold">Perfil do Cliente</span>
      </div>

      <form className="space-y-6">
        {/* Main Header Card - Clean Version */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-2xl font-bold text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                  {initials}
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    {customer.name}
                    {customer.active ? (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <XCircle className="h-3.5 w-3.5" /> Inativo
                      </span>
                    )}
                  </h1>
                  <p className="text-muted-foreground font-medium flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Fingerprint className="h-4 w-4" /> {customer.document}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building className="h-4 w-4" />{' '}
                      {customer.typePerson === 'PJ'
                        ? 'Pessoa Jurídica'
                        : 'Pessoa Física'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {!isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="font-semibold shadow-sm h-11 px-6 rounded-lg w-full md:w-auto"
                      asChild
                    >
                      <Link to="/customer" search={{ page: 1 }}>
                        Voltar
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 w-full md:w-auto"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" /> Editar Cliente
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 w-full md:w-auto"
                      onClick={() => setIsEditing(false)}
                      disabled={mutation.isPending}
                    >
                      <X className="h-4 w-4" /> Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 w-full md:w-auto"
                      disabled={mutation.isPending}
                      onClick={form.handleSubmit(onSubmit, onFormError)}
                    >
                      {mutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Salvar Alterações
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-500" />
                  Dados Cadastrais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <InfoItem
                      label="Razão Social / Nome Completo"
                      value={customer.name}
                      icon={User}
                      colSpan={2}
                    />
                    <InfoItem
                      label="Nome Fantasia"
                      value={customer.fantasyName}
                      icon={Building}
                      colSpan={2}
                    />
                    <InfoItem
                      label="Tipo de Cadastro"
                      value={
                        customer.typePerson === 'PJ'
                          ? 'Pessoa Jurídica (PJ)'
                          : 'Pessoa Física (PF)'
                      }
                      icon={Building}
                    />
                    <InfoItem
                      label="Documento (CNPJ/CPF)"
                      value={customer.document}
                      icon={Fingerprint}
                    />
                    <InfoItem
                      label="Inscrição Estadual (IE)"
                      value={customer.ie}
                    />
                    <InfoItem
                      label="Data de Fundação / Nasc."
                      value={
                        customer.birthdate
                          ? format(new Date(customer.birthdate), 'PP', {
                              locale: ptBR,
                            })
                          : null
                      }
                      icon={CalendarIcon}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Razão Social / Nome Completo
                      </Label>
                      <Input
                        id="name"
                        className={getInputClassName('name')}
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <span className="text-red-500 text-xs">
                          {form.formState.errors.name.message}
                        </span>
                      )}
                    </div>
                    {customer.typePerson === 'PJ' && (
                      <div className="space-y-3 md:col-span-2">
                        <Label
                          htmlFor="fantasyName"
                          className="text-sm font-semibold"
                        >
                          Nome Fantasia
                        </Label>
                        <Input
                          id="fantasyName"
                          className={getInputClassName('fantasyName')}
                          {...form.register('fantasyName', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                        {renderError('fantasyName')}
                      </div>
                    )}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Tipo de Pessoa
                      </Label>
                      <Controller
                        control={form.control}
                        name="typePerson"
                        render={({ field }) => (
                          <Select
                            value={field.value as string}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={getInputClassName('typePerson')}
                            >
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PJ">
                                Pessoa Jurídica (PJ)
                              </SelectItem>
                              <SelectItem value="PF">
                                Pessoa Física (PF)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {renderError('typePerson')}
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="document"
                        className="text-sm font-semibold"
                      >
                        Documento (CNPJ/CPF)
                      </Label>
                      <Input
                        id="document"
                        disabled
                        className={getInputClassName(
                          'document',
                          'h-11 rounded-lg bg-muted cursor-not-allowed',
                        )}
                        {...form.register('document')}
                      />
                      {form.formState.errors.document && (
                        <span className="text-red-500 text-xs">
                          {form.formState.errors.document.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="ie" className="text-sm font-semibold">
                        Inscrição Estadual (IE)
                      </Label>
                      <Input
                        id="ie"
                        className={getInputClassName('ie')}
                        {...form.register('ie', {
                          setValueAs: (v) => (v === '' ? undefined : v),
                        })}
                      />
                      {renderError('ie')}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Data de Fundação / Nasc.
                      </Label>
                      <Controller
                        control={form.control}
                        name="birthdate"
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full h-11 rounded-lg justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                  form.formState.errors.birthdate &&
                                    'border-red-500 focus-visible:ring-red-500',
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value as Date, 'PPP', {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value as Date}
                                onSelect={field.onChange}
                                locale={ptBR}
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      {renderError('birthdate')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-violet-500" /> Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoItem label="CEP" value={customer.zipcode} />
                    <InfoItem
                      label="Cidade e Estado"
                      value={
                        customer.city
                          ? `${customer.city.name} - ${customer.city.state}`
                          : null
                      }
                    />
                    <InfoItem label="Bairro" value={customer.neighborhood} />
                    <InfoItem
                      label="Logradouro"
                      value={[
                        customer.address,
                        customer.addressNumber,
                        customer.complement ? `(${customer.complement})` : null,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="zipcode"
                        className="text-sm font-semibold"
                      >
                        CEP
                      </Label>
                      <Input
                        id="zipcode"
                        className={getInputClassName('zipcode')}
                        {...form.register('zipcode', {
                          setValueAs: (v) => (v === '' ? undefined : v),
                        })}
                      />
                      {renderError('zipcode')}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Estado</Label>
                      <Select
                        value={selectedState}
                        onValueChange={(val) => {
                          setSelectedState(val);
                          form.setValue('cityId', undefined as any, { shouldDirty: true });
                          setCitySearch('');
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-lg">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(states).map(([uf, name]) => (
                            <SelectItem key={uf} value={uf}>
                              {name} ({uf})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3 relative md:col-span-2">
                      <Label
                        htmlFor="citySearch"
                        className="text-sm font-semibold"
                      >
                        Cidade
                      </Label>
                      <Input
                        id="citySearch"
                        placeholder="Digite a cidade"
                        className={getInputClassName('cityId')}
                        value={citySearch}
                        disabled={!selectedState}
                        onChange={(e) => {
                          setCitySearch(e.target.value);
                          setShowCitiesDropdown(true);
                          form.setValue('cityId', undefined as any, { shouldDirty: true });
                        }}
                        onFocus={() => {
                          if (selectedState) setShowCitiesDropdown(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowCitiesDropdown(false), 200)
                        }
                      />
                      {showCitiesDropdown && cities.length > 0 && (
                        <div className="absolute z-10 w-full bg-popover shadow-md rounded-md border mt-1 max-h-60 overflow-auto">
                          {cities.map((c) => (
                            <div
                              key={c.id}
                              className="px-4 py-2 cursor-pointer hover:bg-muted text-sm"
                              onClick={() => {
                                setCitySearch(c.name);
                                form.setValue('cityId', c.id, { shouldDirty: true });
                                setShowCitiesDropdown(false);
                              }}
                            >
                              {c.name}
                            </div>
                          ))}
                        </div>
                      )}
                      {renderError('cityId')}
                    </div>
                    <div className="space-y-3 md:col-span-2 grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-12 space-y-3">
                        <Label
                          htmlFor="address"
                          className="text-sm font-semibold"
                        >
                          Logradouro
                        </Label>
                        <Input
                          id="address"
                          className={getInputClassName('address')}
                          {...form.register('address', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                        {renderError('address')}
                      </div>
                      <div className="col-span-12 md:col-span-6 space-y-3">
                        <Label
                          htmlFor="neighborhood"
                          className="text-sm font-semibold"
                        >
                          Bairro
                        </Label>
                        <Input
                          id="neighborhood"
                          className={getInputClassName('neighborhood')}
                          {...form.register('neighborhood', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                        {renderError('neighborhood')}
                      </div>
                      <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label
                          htmlFor="addressNumber"
                          className="text-sm font-semibold"
                        >
                          Número
                        </Label>
                        <Input
                          id="addressNumber"
                          type="number"
                          className={getInputClassName('addressNumber')}
                          {...form.register('addressNumber', {
                            setValueAs: (v) =>
                              v === '' ? undefined : Number(v),
                          })}
                        />
                        {renderError('addressNumber')}
                      </div>
                      <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label
                          htmlFor="complement"
                          className="text-sm font-semibold"
                        >
                          Complemento
                        </Label>
                        <Input
                          id="complement"
                          className={getInputClassName('complement')}
                          {...form.register('complement', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                        {renderError('complement')}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Contact & Status */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Phone className="h-5 w-5 text-violet-500" /> Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {!isEditing ? (
                  <>
                    <InfoItem
                      label="Email Corporativo"
                      value={customer.email}
                      icon={Mail}
                    />
                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />
                    <InfoItem
                      label="Telefone Principal"
                      value={customer.phone}
                      icon={Phone}
                    />
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="email"
                          className={getInputClassName(
                            'email',
                            'h-11 rounded-lg pl-10',
                          )}
                          {...form.register('email', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                      </div>
                      {renderError('email')}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Telefone
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="phone"
                          className={getInputClassName(
                            'phone',
                            'h-11 rounded-lg pl-10',
                          )}
                          {...form.register('phone', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                      </div>
                      {renderError('phone')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Status toggle in edit mode */}
            {isEditing && (
              <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
                <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-violet-500" /> Configurações
                    de Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      Status do Cliente
                    </Label>
                    <Controller
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <Select
                          value={field.value as string}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={getInputClassName('active')}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              Ativo (Pode operar)
                            </SelectItem>
                            <SelectItem value="false">
                              Inativo (Bloqueado)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {renderError('active')}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerViewPage;
