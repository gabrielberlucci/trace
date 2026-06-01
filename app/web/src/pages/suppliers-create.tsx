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
import {
  Building2,
  MapPin,
  Contact,
  Settings,
  Info,
  Search,
  Mail,
  Phone,
  Save,
} from 'lucide-react';

const SuppliersCreatePage = () => {
  return (
    <>
            {/* Header */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Novo Fornecedor
                  </h1>
                  <p className="text-muted-foreground">
                    Cadastre os detalhes de um novo parceiro logístico ou
                    comercial.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="font-semibold shadow-sm px-6 h-11 rounded-lg"
                  >
                    Cancelar
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg gap-2">
                    <Save className="h-4 w-4" /> Salvar Fornecedor
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
                          placeholder="Ex: Logística Silva LTDA"
                          className="h-11 rounded-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="typePerson"
                          className="text-sm font-semibold text-foreground"
                        >
                          Tipo de Pessoa <span className="text-red-500">*</span>
                        </Label>
                        <Select defaultValue="PJ">
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
                            <SelectItem value="PF">
                              Pessoa Física (PF)
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                          placeholder="00.000.000/0000-00"
                          className="h-11 rounded-lg"
                        />
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
                          placeholder="Opcional"
                          className="h-11 rounded-lg"
                        />
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
                          CEP <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="zipcode"
                            placeholder="00000-000"
                            className="h-11 rounded-lg pr-12"
                          />
                          <div className="absolute inset-y-0 right-0 w-11 flex items-center justify-center pointer-events-none">
                            <Search className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label
                          htmlFor="city"
                          className="text-sm font-semibold text-foreground"
                        >
                          Cidade / Estado{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder="Nome da cidade"
                          className="h-11 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="space-y-3 md:col-span-8">
                        <Label
                          htmlFor="address"
                          className="text-sm font-semibold text-foreground"
                        >
                          Logradouro <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address"
                          placeholder="Rua, Avenida, etc."
                          className="h-11 rounded-lg"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-4">
                        <Label
                          htmlFor="number"
                          className="text-sm font-semibold text-foreground"
                        >
                          Número <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="number"
                          placeholder="S/N"
                          className="h-11 rounded-lg"
                        />
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
                        placeholder="Sala, Andar, Galpão..."
                        className="h-11 rounded-lg"
                      />
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
                        E-mail Principal <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="email"
                          placeholder="contato@empresa.com"
                          className="h-11 rounded-lg pl-12 pr-4"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-foreground"
                      >
                        Telefone / WhatsApp{' '}
                        <span className="text-red-500">*</span>
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
                  </CardContent>
                </Card>

                {/* Configurações */}
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                        <Settings className="h-5 w-5" />
                      </div>
                      Configurações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-card shadow-sm">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold text-foreground">
                          Status do Fornecedor
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Ativar ou desativar temporariamente
                        </p>
                      </div>
                      <Switch
                        defaultChecked
                        className="data-[state=checked]:bg-violet-600"
                      />
                    </div>

                    <div className="bg-violet-50/50 dark:bg-violet-900/10 rounded-xl p-5 flex gap-4 border border-violet-100 dark:border-violet-900/30">
                      <div className="text-violet-600 dark:text-violet-400 shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <p className="text-[13px] text-violet-800 dark:text-violet-300 leading-relaxed font-medium">
                        Fornecedores inativos não aparecerão nas opções de
                        criação de novas ordens de compra (PO).
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
  );
};

export default SuppliersCreatePage;
