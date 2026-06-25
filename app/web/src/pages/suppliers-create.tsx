import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSupplierSchema } from '@app/shared';
import { getCityByState } from '@/api';
import { createSupplier } from '@/api/suppliers/post-supplier';
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
import {
  Building2,
  MapPin,
  Contact,
  Search,
  Mail,
  Phone,
  Save,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

import type { PaginatedCityData } from '@/types';

type FormInput = z.input<typeof createSupplierSchema>;
type FormOutput = z.infer<typeof createSupplierSchema>;
const SuppliersCreatePage = () => {
  const navigate = useNavigate();
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [cities, setCities] = useState<PaginatedCityData[]>([]);
  const [showCities, setShowCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      typePerson: 'PJ',
    },
  });

  useEffect(() => {
    const fetchCities = async () => {
      if (!stateFilter || cityFilter.length < 2) {
        setCities([]);
        return;
      }
      try {
        const res = await getCityByState(1, stateFilter, cityFilter);
        if (res?.data) {
          setCities(res.data);
        }
      } catch (e) {
        setCities([]);
      }
    };

    const timer = setTimeout(fetchCities, 500);
    return () => clearTimeout(timer);
  }, [stateFilter, cityFilter]);

  const onSubmit = async (data: FormOutput) => {
    try {
      setIsSubmitting(true);
      await createSupplier(data);
      toast.success('Fornecedor criado com sucesso!');
      navigate({ to: '/supplier', search: { page: 1 } as never });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar fornecedor');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Novo Fornecedor
            </h1>
            <p className="text-muted-foreground">
              Cadastre os detalhes de um novo parceiro logístico ou comercial.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-semibold shadow-sm px-6 h-11 rounded-lg"
            >
              <Link to="/supplier" search={{ q: undefined, page: 1 }}>
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
              Salvar Fornecedor
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Informações Gerais */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <div className="h-1 bg-linear-to-r from-violet-500 to-cyan-400 w-full" />
            <CardHeader className="pb-6 pt-8 px-8">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-violet-900 dark:text-violet-100">
                <Building2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    {...register('name')}
                    placeholder="Ex: Logística Silva LTDA"
                    className="h-11 rounded-lg"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="typePerson"
                    className="text-sm font-semibold text-foreground"
                  >
                    Tipo de Pessoa <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="typePerson"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          id="typePerson"
                          className="h-11 rounded-lg"
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PJ">
                            Pessoa Jurídica (PJ)
                          </SelectItem>
                          <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.typePerson && (
                    <span className="text-xs text-red-500">
                      {errors.typePerson.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="document"
                    className="text-sm font-semibold text-foreground"
                  >
                    CNPJ / CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="document"
                    {...register('document')}
                    placeholder="00.000.000/0000-00"
                    className="h-11 rounded-lg"
                  />
                  {errors.document && (
                    <span className="text-xs text-red-500">
                      {errors.document.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label
                    htmlFor="ie"
                    className="text-sm font-semibold text-foreground"
                  >
                    Inscrição Estadual (IE)
                  </Label>
                  <Input
                    id="ie"
                    {...register('ie', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                    placeholder="Opcional"
                    className="h-11 rounded-lg"
                  />
                  {errors.ie && (
                    <span className="text-xs text-red-500">
                      {errors.ie.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                Endereço
              </CardTitle>
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
                  <div className="relative">
                    <Input
                      id="zipcode"
                      {...register('zipcode', {
                        setValueAs: (v) => (v === '' ? undefined : v),
                      })}
                      placeholder="00000-000"
                      className="h-11 rounded-lg pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 w-11 flex items-center justify-center pointer-events-none">
                      <Search className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                  {errors.zipcode && (
                    <span className="text-xs text-red-500">
                      {errors.zipcode.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3 md:col-span-1">
                  <Label
                    htmlFor="state"
                    className="text-sm font-semibold text-foreground"
                  >
                    Estado (UF)
                  </Label>
                  <Input
                    id="state"
                    placeholder="Ex: SP"
                    value={stateFilter}
                    onChange={(e) =>
                      setStateFilter(e.target.value.toUpperCase())
                    }
                    className="h-11 rounded-lg uppercase"
                    maxLength={2}
                  />
                </div>

                <div className="space-y-3 md:col-span-1 relative">
                  <Label
                    htmlFor="city"
                    className="text-sm font-semibold text-foreground"
                  >
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    placeholder="Nome da cidade"
                    value={cityFilter}
                    onChange={(e) => {
                      setCityFilter(e.target.value);
                      setShowCities(true);
                      setValue('cityId', undefined as unknown as number);
                    }}
                    onFocus={() => setShowCities(true)}
                    onBlur={() => setTimeout(() => setShowCities(false), 200)}
                    className="h-11 rounded-lg"
                  />
                  {showCities && cities.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {cities.map((city) => (
                        <li
                          key={city.id}
                          className="px-4 py-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 cursor-pointer text-sm"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCityFilter(city.name);
                            setValue('cityId', city.id);
                            setShowCities(false);
                          }}
                        >
                          {city.name} - {city.state}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.cityId && (
                    <span className="text-xs text-red-500">
                      {errors.cityId.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="space-y-3 md:col-span-8">
                  <Label
                    htmlFor="address"
                    className="text-sm font-semibold text-foreground"
                  >
                    Logradouro
                  </Label>
                  <Input
                    id="address"
                    {...register('address', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                    placeholder="Rua, Avenida, etc."
                    className="h-11 rounded-lg"
                  />
                  {errors.address && (
                    <span className="text-xs text-red-500">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3 md:col-span-4">
                  <Label
                    htmlFor="number"
                    className="text-sm font-semibold text-foreground"
                  >
                    Número
                  </Label>
                  <Input
                    id="number"
                    {...register('addressNumber', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Number(v),
                    })}
                    type="number"
                    placeholder="S/N"
                    className="h-11 rounded-lg"
                  />
                  {errors.addressNumber && (
                    <span className="text-xs text-red-500">
                      {errors.addressNumber.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="complement"
                  className="text-sm font-semibold text-foreground"
                >
                  Complemento
                </Label>
                <Input
                  id="complement"
                  {...register('complement', {
                    setValueAs: (v) => (v === '' ? undefined : v),
                  })}
                  placeholder="Sala, Andar, Galpão..."
                  className="h-11 rounded-lg"
                />
                {errors.complement && (
                  <span className="text-xs text-red-500">
                    {errors.complement.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Contato */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Contact className="h-5 w-5" />
                </div>
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  E-mail Principal
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    {...register('email', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                    placeholder="contato@empresa.com"
                    className="h-11 rounded-lg pl-12 pr-4"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-foreground"
                >
                  Telefone / WhatsApp
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    {...register('phone', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                    placeholder="(00) 00000-0000"
                    className="h-11 rounded-lg pl-12 pr-4"
                  />
                </div>
                {errors.phone && (
                  <span className="text-xs text-red-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default SuppliersCreatePage;
