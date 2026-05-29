import React from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, User, MapPin, Contact, Settings, Shield, AtSign, Calendar, Mail, Phone, Lock, Save } from 'lucide-react';

const UsersCreateFixture = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-muted/40">
          <AppHeader />

          <main className="flex-1 p-8 mx-auto w-full max-w-7xl">
            {/* Breadcrumb & Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="hover:text-violet-600 cursor-pointer font-medium">Usuários</span>
                <span>›</span>
                <span className="text-foreground font-semibold">Novo Usuário</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Cadastrar Usuário</h1>
                  <p className="text-muted-foreground">Preencha os dados abaixo para adicionar um novo acesso ao sistema Trace.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="font-semibold shadow-sm px-6 h-11 rounded-lg">
                    Cancelar
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg gap-2">
                    <Save className="h-4 w-4" /> Salvar Usuário
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
                      <Label htmlFor="name" className="text-sm font-semibold text-foreground">Nome Completo <span className="text-red-500">*</span></Label>
                      <Input id="name" placeholder="Ex: João da Silva" className="h-11 rounded-lg" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="username" className="text-sm font-semibold text-foreground">Nome de Usuário <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <AtSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input id="username" placeholder="joao.silva" className="h-11 rounded-lg pl-12 pr-4" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="birthdate" className="text-sm font-semibold text-foreground">Data de Nascimento</Label>
                        <div className="relative">
                          <Input id="birthdate" placeholder="mm/dd/yyyy" className="h-11 rounded-lg pl-12 pr-4" />
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contato e Acesso */}
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                        <Contact className="h-5 w-5" />
                      </div>
                      Contato e Acesso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input id="email" placeholder="joao@exemplo.com" className="h-11 rounded-lg pl-12 pr-4" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold text-foreground">Telefone</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input id="phone" placeholder="(00) 00000-0000" className="h-11 rounded-lg pl-12 pr-4" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm font-semibold text-foreground">Senha Provisória <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input id="password" type="password" placeholder="••••••••" className="h-11 rounded-lg pl-12 pr-4" />
                        </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="space-y-3 md:col-span-4">
                        <Label htmlFor="zipcode" className="text-sm font-semibold text-foreground">CEP</Label>
                        <Input id="zipcode" placeholder="00000-000" className="h-11 rounded-lg" />
                      </div>
                      <div className="space-y-3 md:col-span-8">
                        <Label htmlFor="address" className="text-sm font-semibold text-foreground">Logradouro</Label>
                        <Input id="address" placeholder="Rua, Avenida, etc." className="h-11 rounded-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="space-y-3 md:col-span-3">
                        <Label htmlFor="number" className="text-sm font-semibold text-foreground">Número</Label>
                        <Input id="number" placeholder="123" className="h-11 rounded-lg" />
                      </div>
                      <div className="space-y-3 md:col-span-4">
                        <Label htmlFor="complement" className="text-sm font-semibold text-foreground">Complemento</Label>
                        <Input id="complement" placeholder="Apto, Sala" className="h-11 rounded-lg" />
                      </div>
                      <div className="space-y-3 md:col-span-5">
                        <Label htmlFor="city" className="text-sm font-semibold text-foreground">Cidade</Label>
                        <Input id="city" placeholder="São Paulo" className="h-11 rounded-lg" />
                      </div>
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
                      <Label htmlFor="role" className="text-sm font-semibold text-foreground">Nível de Acesso (Role) <span className="text-red-500">*</span></Label>
                      <Select>
                        <SelectTrigger id="role" className="h-11 rounded-lg">
                          <SelectValue placeholder="Selecione um nível..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador (Total)</SelectItem>
                          <SelectItem value="manager">Gerente (Parcial)</SelectItem>
                          <SelectItem value="operator">Operador / Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mt-2.5">
                        Define as permissões que o usuário terá dentro do sistema Trace.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold text-foreground">Status da Conta</Label>
                        <p className="text-[13px] text-muted-foreground">Ativar ou desativar o acesso</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-violet-600" />
                    </div>

                  </CardContent>
                </Card>

                {/* Segurança Trace Callout */}
                <div className="rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-violet-100 dark:from-indigo-950/40 dark:to-violet-900/40 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
                  
                  <div className="mb-6 text-violet-600 dark:text-violet-400 bg-white dark:bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative z-10">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-3 text-lg relative z-10">Segurança Trace</h3>
                  <p className="text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed font-medium relative z-10">
                    Senhas provisórias devem conter no mínimo 8 caracteres. O usuário será solicitado a alterar a senha no primeiro acesso para garantir a segurança da conta.
                  </p>
                </div>

              </div>
            </div>

          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default UsersCreateFixture;



