import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userSchema } from '@app/shared';
import { createUser, getStates, getCityByState, getRoles } from '@/api';
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
  User,
  MapPin,
  Contact,
  Settings,
  AtSign,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { PaginatedCityData, RoleData } from '@/types';

type FormInput = z.input<typeof userSchema>;
type FormOutput = z.infer<typeof userSchema>;

const UsersCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [states, setStates] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState<PaginatedCityData[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);
  const [roles, setRoles] = useState<RoleData[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = (await getStates()) as {
          data: Record<string, string>;
        };
        if (response?.data) {
          setStates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch states', error);
      }
    };
    fetchStates();

    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        if (response?.data) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState || citySearch.length < 2) {
        setCities([]);
        return;
      }
      try {
        const res = await getCityByState(1, selectedState, citySearch);
        if (res?.data) {
          setCities(res.data);
        }
      } catch (e) {
        setCities([]);
      }
    };

    const timer = setTimeout(fetchCities, 600);
    return () => clearTimeout(timer);
  }, [selectedState, citySearch]);

  const onSubmit = async (data: FormOutput) => {
    try {
      setIsSubmitting(true);
      await createUser(data);
      toast.success('Usuário criado com sucesso!');
      navigate({ to: '/user', search: { page: 1 } as never });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar usuário');
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
              Novo Usuário
            </h1>
            <p className="text-muted-foreground">
              Cadastre os detalhes de acesso e informações do colaborador.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-semibold shadow-sm px-6 h-11 rounded-lg"
              asChild
            >
              <Link to="/user" search={{ q: undefined, page: 1 }}>
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
              Salvar Usuário
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Informações Básicas */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground"
                >
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: João da Silva"
                  className="h-11 rounded-lg"
                />
                {errors.name && (
                  <span className="text-xs text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-foreground"
                  >
                    Nome de Usuário <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="username"
                      {...register('username')}
                      placeholder="joao.silva"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                  </div>
                  {errors.username && (
                    <span className="text-xs text-red-500">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="birthdate"
                    className="text-sm font-semibold text-foreground"
                  >
                    Data de Nascimento
                  </Label>
                  <Controller
                    control={control}
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
                              format(field.value as Date, 'PPP', {
                                locale: ptBR,
                              })
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
                  {errors.birthdate && (
                    <span className="text-xs text-red-500">
                      {errors.birthdate.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato e Senha */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Contact className="h-5 w-5" />
                </div>
                Contato e Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email
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
                      placeholder="joao@exemplo.com"
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
                    Telefone
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

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground"
                  >
                    Senha <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      placeholder="••••••••"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="confirmedPassword"
                    className="text-sm font-semibold text-foreground"
                  >
                    Confirmar Senha <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="confirmedPassword"
                      type="password"
                      {...register('confirmedPassword')}
                      placeholder="••••••••"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                  </div>
                  {errors.confirmedPassword && (
                    <span className="text-xs text-red-500">
                      {errors.confirmedPassword.message}
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
                  <Input
                    id="zipcode"
                    {...register('zipcode', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                    placeholder="00000-000"
                    className="h-11 rounded-lg"
                  />
                  {errors.zipcode && (
                    <span className="text-xs text-red-500">
                      {errors.zipcode.message}
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
                      setValue('cityId', undefined as unknown as number);
                    }}
                  >
                    <SelectTrigger id="state" className="h-11 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
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

                <div className="space-y-3 relative">
                  <Label
                    htmlFor="citySearch"
                    className="text-sm font-semibold text-foreground"
                  >
                    Cidade
                  </Label>
                  <Input
                    id="citySearch"
                    placeholder="Digite a cidade"
                    className="h-11 rounded-lg"
                    value={citySearch}
                    disabled={!selectedState}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCitiesDropdown(true);
                      setValue('cityId', undefined as unknown as number);
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
                            e.preventDefault();
                            setCitySearch(city.name);
                            setValue('cityId', city.id);
                            setShowCitiesDropdown(false);
                          }}
                        >
                          {city.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.cityId && (
                    <span className="text-red-500 text-xs">
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
                    Logradouro (Rua/Av.)
                  </Label>
                  <Input
                    id="address"
                    {...register('address', {
                      setValueAs: (v) => (v === '' ? undefined : v),
                    })}
                    placeholder="Ex: Av. Paulista"
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
                    type="number"
                    {...register('addressNumber', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Number(v),
                    })}
                    placeholder="000"
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
                  placeholder="Sala, Andar..."
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
          {/* Configurações de Sistema */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Settings className="h-5 w-5" />
                </div>
                Configurações de Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="space-y-3">
                <Label
                  htmlFor="role"
                  className="text-sm font-semibold text-foreground"
                >
                  Nível de Acesso (Role) <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="roleId"
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger id="role" className="h-11 rounded-lg">
                        <SelectValue placeholder="Selecione um nível..." />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name.charAt(0).toUpperCase() +
                              role.name.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.roleId && (
                  <span className="text-xs text-red-500">
                    {errors.roleId.message}
                  </span>
                )}
                <p className="text-[13px] text-muted-foreground leading-relaxed mt-2.5">
                  Define as permissões que o usuário terá dentro do sistema
                  Trace.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default UsersCreatePage;
