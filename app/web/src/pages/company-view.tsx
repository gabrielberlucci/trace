import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  getSingleCompany,
  modifyCompany,
  getStates,
  getCityByState,
} from '@/api';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Settings,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modifyCompanySchema } from '@app/shared';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isAxiosError } from 'axios';
import type { PaginatedCityData } from '@/types';

type CompanyFormInput = z.input<typeof modifyCompanySchema>;
type CompanyFormOutput = z.output<typeof modifyCompanySchema>;

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

const CompanyViewPage = () => {
  const { id } = useParams({ from: '/_app/company_/$id' });
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
    queryKey: ['company', id],
    queryFn: () => getSingleCompany(Number(id)),
  });

  const form = useForm<CompanyFormInput, unknown, CompanyFormOutput>({
    resolver: zodResolver(modifyCompanySchema),
    values: response?.data
      ? {
          name: response.data.name,
          fantasyName: response.data.fantasyName || undefined,
          email: response.data.email || undefined,
          phone: response.data.phone || undefined,
          ie: response.data.ie || undefined,
          zipcode: response.data.zipcode || undefined,
          address: response.data.address || undefined,
          neighborhood: response.data.neighborhood || undefined,
          addressNumber: response.data.addressNumber || undefined,
          complement: response.data.complement || undefined,
          cityId: response.data.cityId || undefined,
          active: response.data.active ? 'true' : 'false',
        }
      : undefined,
  });

  const { errors, dirtyFields } = form.formState;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const resStates = (await getStates()) as {
          data: Record<string, string>;
        };
        if (resStates?.data) setStates(resStates.data);
      } catch (e) {
        console.error('Failed to fetch states', e);
      }
    };
    fetchStates();
  }, []);

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

  useEffect(() => {
    if (isEditing && response?.data) {
      if (response.data.city) {
        setSelectedState(response.data.city.state || '');
        setCitySearch(response.data.city.name || '');
      }
    }
  }, [isEditing, response]);

  const mutation = useMutation({
    mutationFn: (data: Partial<CompanyFormOutput>) =>
      modifyCompany(Number(id), data as any),
    onSuccess: () => {
      toast.success('Empresa atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
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
      toast.error(err.message || 'Erro ao atualizar empresa');
    },
  });

  const onSubmit = (data: CompanyFormOutput) => {
    if (Object.keys(dirtyFields).length === 0) {
      toast.info('Nenhuma alteração foi feita.');
      setIsEditing(false);
      return;
    }

    const patchData: any = {};
    for (const key of Object.keys(dirtyFields)) {
      patchData[key] = (data as any)[key];
    }

    // Explicitly never send the document in patch
    delete patchData.document;

    mutation.mutate(patchData);
  };

  const onFormError = () => {
    toast.error('Erro de validação, verifique os campos destacados.');
  };

  const getInputClassName = (
    fieldName: keyof CompanyFormInput,
    baseClass: string = 'h-11 rounded-lg',
  ) =>
    cn(
      baseClass,
      errors[fieldName] && 'border-red-500 focus-visible:ring-red-500',
    );

  const renderError = (fieldName: keyof CompanyFormInput) => {
    const error = errors[fieldName];
    if (!error) return null;
    return (
      <span className="text-red-500 text-xs mt-1 block">
        {error.message as string}
      </span>
    );
  };

  if (isFetching && !response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Carregando dados da empresa...
        </p>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/50 p-8">
        <XCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
          Empresa não encontrada
        </h3>
        <p className="text-red-600/80 dark:text-red-400/80 mb-4 text-center max-w-md">
          Não foi possível carregar os dados desta empresa.
        </p>
        <Button asChild variant="outline">
          <Link to="/company" search={{ page: 1 }}>
            Voltar para a lista
          </Link>
        </Button>
      </div>
    );
  }

  const company = response.data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-10 w-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link to="/company" search={{ page: 1 }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {company.name}
              {company.active ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              CNPJ: {company.document} | ID:{' '}
              <span className="font-medium text-foreground">{company.id}</span>
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
              Editar Empresa
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-violet-500" /> Informações
                  Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <InfoItem label="Razão Social" value={company.name} />
                    <InfoItem
                      label="Nome Fantasia"
                      value={company.fantasyName}
                    />
                    <InfoItem label="CNPJ" value={company.document} />
                    <InfoItem label="Inscrição Estadual" value={company.ie} />
                    <InfoItem label="Email" value={company.email} icon={Mail} />
                    <InfoItem
                      label="Telefone"
                      value={company.phone}
                      icon={Phone}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Razão Social <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        className={getInputClassName('name')}
                        {...form.register('name')}
                      />
                      {renderError('name')}
                    </div>
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
                    <div className="space-y-3">
                      <Label
                        htmlFor="document"
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        CNPJ
                      </Label>
                      <Input
                        id="document"
                        value={company.document}
                        disabled
                        className="h-11 rounded-lg bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        O documento não pode ser alterado.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="ie" className="text-sm font-semibold">
                        Inscrição Estadual
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
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="email"
                          className={getInputClassName(
                            'email',
                            'h-11 rounded-lg pl-12 pr-4',
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
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="phone"
                          className={getInputClassName(
                            'phone',
                            'h-11 rounded-lg pl-12 pr-4',
                          )}
                          {...form.register('phone', {
                            setValueAs: (v) => (v === '' ? undefined : v),
                          })}
                        />
                      </div>
                      {renderError('phone')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-violet-500" /> Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoItem label="CEP" value={company.zipcode} />
                    <InfoItem
                      label="Cidade e Estado"
                      value={
                        company.city
                          ? `${company.city.name} - ${company.city.state}`
                          : null
                      }
                    />
                    <InfoItem label="Bairro" value={company.neighborhood} />
                    <InfoItem
                      label="Logradouro"
                      value={[
                        company.address,
                        company.addressNumber,
                        company.complement ? `(${company.complement})` : null,
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
                          form.setValue('cityId', undefined as any);
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
                          form.setValue('cityId', undefined as any);
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
                                form.setValue('cityId', c.id);
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

          {/* Right Sidebar - Status */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5 text-violet-500" /> Permissões e
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Status do Cadastro
                      </Label>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          company.active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {company.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
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
                            <SelectTrigger
                              className={getInputClassName('active')}
                            >
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

export default CompanyViewPage;
