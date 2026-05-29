import React from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  CreditCard,
  Lock,
  Copy,
  EyeOff,
  ShieldCheck,
  Activity,
  Settings2,
} from 'lucide-react';

const PaymentsCreatePage = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-muted/40">
          <AppHeader />

          <main className="flex-1 p-8 mx-auto w-full max-w-7xl">
            {/* Header */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Nova Forma de Pagamento
                  </h1>
                  <p className="text-muted-foreground">
                    Configure os detalhes de integração para um novo método.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="font-semibold shadow-sm px-6 h-11 rounded-lg"
                  >
                    Cancelar
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg">
                    Salvar Configuração
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
                        htmlFor="name"
                        className="text-sm font-semibold text-foreground"
                      >
                        Nome do Método <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ex: Cartão de Crédito Visa/Master"
                        className="h-11 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label
                          htmlFor="integration"
                          className="text-sm font-semibold text-foreground"
                        >
                          Tipo de Integração{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="integration"
                            className="h-11 rounded-lg"
                          >
                            <SelectValue placeholder="Selecione um provedor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pos">
                              Maquininha (POS)
                            </SelectItem>
                            <SelectItem value="tef">Integração TEF</SelectItem>
                            <SelectItem value="pix">Gateway PIX</SelectItem>
                            <SelectItem value="outro">
                              Outro / Manual
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="currency"
                          className="text-sm font-semibold text-foreground"
                        >
                          Moeda Padrão <span className="text-red-500">*</span>
                        </Label>
                        <Select defaultValue="BRL">
                          <SelectTrigger
                            id="currency"
                            className="h-11 rounded-lg"
                          >
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">
                              BRL - Real Brasileiro
                            </SelectItem>
                            <SelectItem value="USD">
                              USD - Dólar Americano
                            </SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Credenciais da API */}
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                        <Lock className="h-5 w-5" />
                      </div>
                      Credenciais da API
                    </CardTitle>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800/50">
                      <ShieldCheck className="h-4 w-4" />
                      Seguro
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="pubkey"
                        className="text-sm font-semibold text-foreground"
                      >
                        Chave Pública (Public Key)
                      </Label>
                      <div className="relative">
                        <Input
                          id="pubkey"
                          placeholder="pk_test_..."
                          className="h-11 rounded-lg pr-12 font-mono text-[13px]"
                        />
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center cursor-pointer hover:text-violet-600">
                          <Copy className="h-4 w-4 text-muted-foreground hover:text-violet-600 transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="seckey"
                        className="text-sm font-semibold text-foreground"
                      >
                        Chave Secreta (Secret Key)
                      </Label>
                      <div className="relative">
                        <Input
                          id="seckey"
                          placeholder="sk_test_..."
                          type="password"
                          className="h-11 rounded-lg pr-12 font-mono text-[13px]"
                        />
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center cursor-pointer">
                          <EyeOff className="h-4 w-4 text-muted-foreground hover:text-violet-600 transition-colors" />
                        </div>
                      </div>
                      <p className="text-[13px] text-muted-foreground font-medium">
                        A chave secreta será criptografada no banco de dados.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="webhook"
                        className="text-sm font-semibold text-foreground"
                      >
                        Webhook Secret (Opcional)
                      </Label>
                      <Input
                        id="webhook"
                        placeholder="whsec_..."
                        className="h-11 rounded-lg font-mono text-[13px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Status Operacional */}
                <Card className="border-violet-200 dark:border-violet-800/60 shadow-md rounded-2xl overflow-hidden relative bg-card">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-violet-500" />
                  <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                        <Activity className="h-5 w-5" />
                      </div>
                      Status Operacional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex items-center justify-between border border-violet-100 dark:border-violet-900/30 bg-violet-50/30 dark:bg-violet-900/10 rounded-xl p-5 shadow-sm">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold text-foreground">
                          Ativo
                        </Label>
                        <p className="text-[13px] text-muted-foreground">
                          Visível para clientes
                        </p>
                      </div>
                      <Switch
                        defaultChecked
                        className="data-[state=checked]:bg-violet-600"
                      />
                    </div>

                    <div className="flex items-start gap-3.5 p-2">
                      <Checkbox
                        id="sandbox"
                        className="mt-1 h-5 w-5 border-2"
                      />
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="sandbox"
                          className="text-sm font-semibold text-foreground cursor-pointer"
                        >
                          Modo Teste (Sandbox)
                        </Label>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                          Transações não serão cobradas e não afetam relatórios
                          financeiros.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Restrições */}
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                        <Settings2 className="h-5 w-5" />
                      </div>
                      Restrições
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="minval"
                        className="text-sm font-semibold text-foreground"
                      >
                        Valor Mínimo (R$)
                      </Label>
                      <Input
                        id="minval"
                        placeholder="0.00"
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="maxval"
                        className="text-sm font-semibold text-foreground"
                      >
                        Valor Máximo (R$)
                      </Label>
                      <Input
                        id="maxval"
                        placeholder="Ilimitado"
                        className="h-11 rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default PaymentsCreatePage;
