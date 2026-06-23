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
import { Mail, Phone, Save, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCustomerSchema } from '@app/shared';
import { z } from 'zod';
import { toast } from 'sonner';
import type { CreateCustomerData } from '@/types/customer-type';
import { createCustomer, getStates, getCityByState } from '@/api';
import { useEffect, useState } from 'react';
import type { PaginatedCityData } from '@/types';
import type { UseFormReturn } from 'react-hook-form';

type CustomerFormInput = z.input<typeof createCustomerSchema>;
type CustomerFormOutput = z.output<typeof createCustomerSchema>;

const CityAutocomplete = ({
  form,
  selectedState,
}: {
  form: UseFormReturn<CustomerFormInput, unknown, CustomerFormOutput>;
  selectedState: string;
}) => {
  const [cities, setCities] = useState<PaginatedCityData[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([]);
        return;
      }
      try {
        const response = await getCityByState(1, selectedState, citySearch);
        if (response?.data) {
          setCities(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch cities', error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCities();
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [selectedState, citySearch]);

  return (
    <div className="space-y-3 relative">
      <Label
        htmlFor="citySearch"
        className="text-sm font-semibold text-foreground"
      >
        Cidade
      </Label>
      <Input
        id="citySearch"
        placeholder="Digite o nome da cidade"
        className="h-11 rounded-lg"
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
        onBlur={() => setShowCitiesDropdown(false)}
      />

      {showCitiesDropdown && cities.length > 0 && (
        <div className="absolute z-10 w-full bg-popover text-popover-foreground shadow-md rounded-md border mt-1 max-h-60 overflow-auto">
          {cities.map((city) => (
            <div
              key={city.id}
              className="px-4 py-2 cursor-pointer hover:bg-muted text-sm"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur from firing first
                setCitySearch(city.name);
                form.setValue('cityId', city.id);
                setShowCitiesDropdown(false);
              }}
            >
              {city.name}
            </div>
          ))}
        </div>
      )}
      {form.formState.errors.cityId && (
        <span className="text-red-500 text-xs">
          {form.formState.errors.cityId.message}
        </span>
      )}
    </div>
  );
};

const CustomersCreatePage = () => {
  const navigate = useNavigate();

  const [states, setStates] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState<string>('');

  const form = useForm<CustomerFormInput, unknown, CustomerFormOutput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      typePerson: 'PJ',
    },
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response: any = await getStates();
        if (response?.data) {
          setStates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch states', error);
      }
    };
    fetchStates();
  }, []);

  const onSubmit = async (data: CustomerFormOutput) => {
    try {
      const payload: CreateCustomerData = {
        document: data.document,
        typePerson: data.typePerson || 'PJ',
        name: data.name,
        birthdate: data.birthdate as Date,
        phone: data.phone,
        address: data.address,
        zipcode: data.zipcode,
        addressNumber: data.addressNumber,
        complement: data.complement,
        email: data.email,
        ie: data.ie,
        active: 'true',
        cityId: data.cityId,
      };
      await createCustomer(payload);
      toast.success('Cliente cadastrado com sucesso!');
      navigate({ to: '/customer', search: { q: undefined, page: 1 } });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao cadastrar cliente');
      }
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="hover:text-violet-600 cursor-pointer font-medium">
            Clientes
          </span>
          <span>›</span>
          <span className="text-foreground font-semibold">Novo Cliente</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Cadastrar Cliente
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para adicionar um novo cliente ao
              sistema.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-semibold shadow-sm px-6 h-11 rounded-lg"
              asChild
            >
              <Link to="/customer" search={{ q: undefined, page: 1 }}>
                Cancelar
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg gap-2"
            >
              <Save className="h-4 w-4" />{' '}
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="max-w-5xl space-y-8">
        {/* Informações Principais */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
            <CardTitle className="text-xl font-bold text-foreground">
              Informações Principais
            </CardTitle>
            <p className="text-[14px] text-muted-foreground">
              Dados de identificação do cliente.
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="typePerson"
                  className="text-sm font-semibold text-foreground"
                >
                  Tipo de Pessoa <span className="text-red-500">*</span>
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
                        id="typePerson"
                        className="h-11 rounded-lg"
                      >
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                        <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.typePerson && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.typePerson.message}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="document"
                  className="text-sm font-semibold text-foreground"
                >
                  Documento (CNPJ/CPF) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="document"
                  placeholder="00.000.000/0000-00"
                  className="h-11 rounded-lg"
                  {...form.register('document')}
                />
                {form.formState.errors.document && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.document.message}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="ie"
                  className="text-sm font-semibold text-foreground"
                >
                  Inscrição Estadual (IE)
                </Label>
                <Input
                  id="ie"
                  placeholder="ISENTO ou Número"
                  className="h-11 rounded-lg"
                  {...form.register('ie', {
                    setValueAs: (v) => (v === '' ? undefined : v),
                  })}
                />
                {form.formState.errors.ie && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.ie.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 md:col-span-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground"
                >
                  Razão Social / Nome Completo{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Insira o nome oficial"
                  className="h-11 rounded-lg"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.name.message}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="birthdate"
                  className="text-sm font-semibold text-foreground"
                >
                  Data de Fundação / Nasc.
                </Label>
                <Controller
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="birthdate"
                          variant="outline"
                          className={cn(
                            'w-full h-11 rounded-lg justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value as Date, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
                          locale={ptBR}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {form.formState.errors.birthdate && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.birthdate.message}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
            <CardTitle className="text-xl font-bold text-foreground">
              Contato
            </CardTitle>
            <p className="text-[14px] text-muted-foreground">
              Informações de comunicação primária.
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Email Corporativo
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    placeholder="contato@empresa.com.br"
                    className="h-11 rounded-lg pl-12 pr-4"
                    {...form.register('email', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                  />
                </div>
                {form.formState.errors.email && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-foreground"
                >
                  Telefone Principal
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    className="h-11 rounded-lg pl-12 pr-4"
                    {...form.register('phone', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                  />
                </div>
                {form.formState.errors.phone && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.phone.message}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
            <CardTitle className="text-xl font-bold text-foreground">
              Endereço
            </CardTitle>
            <p className="text-[14px] text-muted-foreground">
              Localização do faturamento/sede.
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="zipcode"
                  className="text-sm font-semibold text-foreground"
                >
                  CEP
                </Label>
                <Input
                  id="zipcode"
                  placeholder="00000-000"
                  className="h-11 rounded-lg"
                  {...form.register('zipcode', {
                    setValueAs: (v) => (v === '' ? undefined : v),
                  })}
                />
                {form.formState.errors.zipcode && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.zipcode.message}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="state"
                  className="text-sm font-semibold text-foreground"
                >
                  Estado
                </Label>
                <Select
                  value={selectedState}
                  onValueChange={(val) => {
                    setSelectedState(val);
                    form.setValue('cityId', undefined as any);
                  }}
                >
                  <SelectTrigger id="state" className="h-11 rounded-lg">
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

              <CityAutocomplete form={form} selectedState={selectedState} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="space-y-3 md:col-span-6">
                <Label
                  htmlFor="address"
                  className="text-sm font-semibold text-foreground"
                >
                  Logradouro (Rua/Av.)
                </Label>
                <Input
                  id="address"
                  placeholder="Ex: Av. Paulista"
                  className="h-11 rounded-lg"
                  {...form.register('address', {
                    setValueAs: (v) => (v === '' ? undefined : v),
                  })}
                />
                {form.formState.errors.address && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.address.message}
                  </span>
                )}
              </div>
              <div className="space-y-3 md:col-span-3">
                <Label
                  htmlFor="number"
                  className="text-sm font-semibold text-foreground"
                >
                  Número
                </Label>
                <Input
                  id="number"
                  type="number"
                  placeholder="000"
                  className="h-11 rounded-lg"
                  {...form.register('addressNumber', {
                    setValueAs: (v) => (v === '' ? undefined : Number(v)),
                  })}
                />
                {form.formState.errors.addressNumber && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.addressNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-3 md:col-span-3">
                <Label
                  htmlFor="complement"
                  className="text-sm font-semibold text-foreground"
                >
                  Complemento
                </Label>
                <Input
                  id="complement"
                  placeholder="Sala"
                  className="h-11 rounded-lg"
                  {...form.register('complement', {
                    setValueAs: (v) => (v === '' ? undefined : v),
                  })}
                />
                {form.formState.errors.complement && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.complement.message}
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

export default CustomersCreatePage;
