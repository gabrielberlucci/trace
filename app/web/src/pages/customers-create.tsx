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
import { Switch } from '@/components/ui/switch';
import { Calendar, Mail, Phone, Save } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const CustomersCreatePage = () => {
  return (
    <>
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
            >
              <Link to="/customer" search={{ q: undefined, page: 1 }}>
                Cancelar
              </Link>
            </Button>

            <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg gap-2">
              <Save className="h-4 w-4" /> Salvar Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
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
                  <Select defaultValue="PJ">
                    <SelectTrigger id="typePerson" className="h-11 rounded-lg">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                      <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                    </SelectContent>
                  </Select>
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
                  />
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
                  />
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
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="birthdate"
                    className="text-sm font-semibold text-foreground"
                  >
                    Data de Fundação / Nasc.
                  </Label>
                  <div className="relative">
                    <Input
                      id="birthdate"
                      placeholder="mm/dd/yyyy"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
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
                    Email Corporativo <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      placeholder="contato@empresa.com.br"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-foreground"
                  >
                    Telefone Principal <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                  </div>
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
                    CEP <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zipcode"
                    placeholder="00000-000"
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-semibold text-foreground"
                  >
                    Cidade / Estado <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="Ex: São Paulo / SP"
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="space-y-3 md:col-span-6">
                  <Label
                    htmlFor="address"
                    className="text-sm font-semibold text-foreground"
                  >
                    Logradouro (Rua/Av.) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Ex: Av. Paulista"
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-3 md:col-span-3">
                  <Label
                    htmlFor="number"
                    className="text-sm font-semibold text-foreground"
                  >
                    Número <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="number"
                    placeholder="000"
                    className="h-11 rounded-lg"
                  />
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
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Configurações */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold text-foreground">
                Configurações
              </CardTitle>
              <p className="text-[14px] text-muted-foreground">
                Status da conta do cliente.
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-card shadow-sm">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-foreground">
                    Status do Cliente
                  </Label>
                  <p className="text-[13px] text-muted-foreground">
                    Ativar ou desativar acesso
                  </p>
                </div>
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CustomersCreatePage;
