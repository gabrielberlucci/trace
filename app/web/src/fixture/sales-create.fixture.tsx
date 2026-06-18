import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UserPlus,
  Barcode,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Lock,
  Monitor,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const searchResults = [
  {
    id: 101,
    name: 'MacBook Pro 14" M3 Pro',
    sku: 'MB-14-M3P-512',
    price: 1999.0,
    stock: 42,
    icon: Monitor,
  },
  {
    id: 102,
    name: 'Magic Keyboard com Touch ID',
    sku: 'MK-TID-001',
    price: 149.0,
    stock: 8,
    icon: Monitor,
  },
  {
    id: 103,
    name: 'Studio Display - Vidro Standard',
    sku: 'SD-STD-001',
    price: 1599.0,
    stock: 2,
    icon: Monitor,
  },
];

const SalesCreateFixture = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

  // Dynamic Cart State

  // TODO: type this cart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cartItems, setCartItems] = useState<any[]>([]);

  // TODO: Type this as well
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddProduct = (product: any) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
    setSearchFocused(false);
  };

  const handleUpdateQty = (id: number, delta: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full flex-col bg-muted/20 min-h-screen">
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-350 mx-auto h-full flex flex-col">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Nova Venda
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm font-medium">
                    Terminal PDV #04 • Caixa: Admin
                  </p>
                </div>

                <div className="relative">
                  <Button
                    variant={selectedCustomer ? 'default' : 'outline'}
                    className={cn(
                      'shadow-sm gap-2 font-semibold transition-all',
                      selectedCustomer
                        ? 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600'
                        : 'bg-card border-border/50 hover:bg-muted/50',
                    )}
                    onClick={() =>
                      setCustomerDropdownOpen(!customerDropdownOpen)
                    }
                  >
                    <UserPlus className="w-4 h-4" />
                    {selectedCustomer
                      ? `Cliente: ${selectedCustomer}`
                      : 'Atribuir Cliente'}
                  </Button>

                  {customerDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="p-2 border-b border-border/50 bg-muted/20">
                        <Input
                          placeholder="Buscar cliente (CPF/Nome)..."
                          className="h-9 bg-background text-xs border-border/50"
                          autoFocus
                        />
                      </div>
                      <div className="p-1 max-h-50 overflow-y-auto">
                        {[
                          'Gabriel Berlucci',
                          'Mariana Costa',
                          'Roberto Mendes',
                        ].map((name) => (
                          <div
                            key={name}
                            className="px-3 py-2 text-sm hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedCustomer(name);
                              setCustomerDropdownOpen(false);
                            }}
                          >
                            <p className="font-semibold text-foreground">
                              {name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Cliente Registrado
                            </p>
                          </div>
                        ))}
                      </div>
                      {selectedCustomer && (
                        <div
                          className="p-2 border-t border-border/50 bg-red-500/10 text-red-500 text-xs font-bold text-center cursor-pointer hover:bg-red-500/20 transition-colors"
                          onClick={() => {
                            setSelectedCustomer(null);
                            setCustomerDropdownOpen(false);
                          }}
                        >
                          Remover Cliente
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Main POS Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
                {/* Lado Esquerdo - Carrinho (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Omnibar Search */}
                  <div className="relative z-50">
                    <div
                      className={cn(
                        'flex items-center gap-2 p-2 bg-card border rounded-xl shadow-sm transition-all duration-300',
                        searchFocused
                          ? 'border-violet-500 shadow-md shadow-violet-500/10 ring-1 ring-violet-500'
                          : 'border-border/60',
                      )}
                    >
                      <div className="pl-3 text-muted-foreground">
                        <Barcode className="w-6 h-6" />
                      </div>
                      <Input
                        placeholder="Bipar código de barras ou buscar por nome / SKU..."
                        className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-12"
                        onFocus={() => setSearchFocused(true)}
                      />
                      {searchFocused && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mr-2 h-8 px-2 text-xs text-muted-foreground"
                          onClick={() => setSearchFocused(false)}
                        >
                          Fechar
                        </Button>
                      )}
                      <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-muted rounded-md border border-border/50 text-xs font-bold text-muted-foreground mr-2">
                        <span>ENTER</span>
                      </div>
                      <Button className="h-12 w-12 bg-violet-600 hover:bg-violet-700 rounded-lg shrink-0">
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>

                    {/* Rich Search Dropdown (Simulated) */}
                    {searchFocused && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Resultados da Busca
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Clique ou pressione Enter para adicionar
                          </span>
                        </div>
                        <div className="p-2 space-y-1">
                          {searchResults.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-violet-500/10',
                              )}
                              onClick={() => handleAddProduct(item)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center border border-border/50">
                                  <item.icon className="w-5 h-5 text-foreground/70" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-foreground">
                                    {item.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {item.sku}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <span
                                    className={cn(
                                      'text-xs font-bold px-2 py-1 rounded-full',
                                      item.stock > 10
                                        ? 'bg-emerald-500/10 text-emerald-600'
                                        : 'bg-red-500/10 text-red-600',
                                    )}
                                  >
                                    Estoque: {item.stock}
                                  </span>
                                </div>
                                <div className="font-bold text-foreground min-w-25 text-right">
                                  R${' '}
                                  {item.price.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cart Table Card */}
                  <Card className="border-border/50 shadow-sm bg-card overflow-hidden min-h-100 flex flex-col">
                    <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border/50 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-5">Produto</div>
                        <div className="col-span-3 text-center">Quantidade</div>
                        <div className="col-span-2 text-right">Preço</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
                          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-10 h-10 text-muted-foreground/50" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            O carrinho está vazio
                          </h3>
                          <p className="text-muted-foreground max-w-75">
                            Utilize a barra de busca acima ou bipe um código de
                            barras para adicionar itens à venda.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/10 transition-colors group"
                            >
                              <div className="col-span-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border border-border/50 shrink-0">
                                  <item.icon className="w-6 h-6 text-foreground/70" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                                    {item.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                    SKU: {item.sku}
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-3 flex justify-center">
                                <div className="flex items-center bg-background border border-border/50 rounded-lg p-1 w-30">
                                  <button
                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                                    onClick={() => handleUpdateQty(item.id, -1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="flex-1 text-center font-bold text-sm">
                                    {item.qty}
                                  </span>
                                  <button
                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                                    onClick={() => handleUpdateQty(item.id, 1)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="col-span-2 text-right font-medium text-sm text-foreground/80">
                                R${' '}
                                {item.price.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                })}
                              </div>

                              <div className="col-span-2 flex items-center justify-end gap-2 text-right font-bold text-sm text-foreground">
                                <span>
                                  R${' '}
                                  {(item.price * item.qty).toLocaleString(
                                    'pt-BR',
                                    { minimumFractionDigits: 2 },
                                  )}
                                </span>
                                <button
                                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all ml-2"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Lado Direito - Order Summary (4 cols) */}
                <div className="lg:col-span-4">
                  <Card className="border-border/50 shadow-md bg-card sticky top-4">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold">
                        Resumo do Pedido
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Lines */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">
                            Subtotal ({cartItems.length} itens)
                          </span>
                          <span className="font-bold text-foreground">
                            R${' '}
                            {subtotal.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Cupom de desconto / %"
                            className="bg-background h-10 disabled:opacity-50"
                            disabled={cartItems.length === 0}
                          />
                          <Button
                            variant="secondary"
                            className="h-10 font-bold bg-muted/80"
                            disabled={cartItems.length === 0}
                          >
                            Aplicar
                          </Button>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">
                            Impostos (ICMS 10%)
                          </span>
                          <span className="font-bold text-foreground">
                            R${' '}
                            {tax.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="h-px w-full bg-border/50 my-6" />

                      {/* Total */}
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-black text-foreground mb-1">
                          Total
                        </span>
                        <div className="text-right">
                          <div className="flex items-end gap-2 justify-end">
                            <span className="text-5xl font-black text-violet-600 tracking-tighter">
                              R${' '}
                              {total.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 block">
                            BRL
                          </span>
                        </div>
                      </div>

                      <div className="h-px w-full bg-border/50 my-6" />

                      {/* Payment Methods */}
                      <div>
                        <div className="grid grid-cols-3 gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50">
                          <button
                            onClick={() => setPaymentMethod('card')}
                            className={cn(
                              'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                              paymentMethod === 'card'
                                ? 'bg-background text-violet-600 shadow-sm border border-border/50'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            <CreditCard className="w-4 h-4" />
                            Cartão
                          </button>
                          <button
                            onClick={() => setPaymentMethod('cash')}
                            className={cn(
                              'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                              paymentMethod === 'cash'
                                ? 'bg-background text-violet-600 shadow-sm border border-border/50'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            <Banknote className="w-4 h-4" />
                            Dinheiro
                          </button>
                          <button
                            onClick={() => setPaymentMethod('pix')}
                            className={cn(
                              'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                              paymentMethod === 'pix'
                                ? 'bg-background text-violet-600 shadow-sm border border-border/50'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            <Smartphone className="w-4 h-4" />
                            Pix
                          </button>
                        </div>
                      </div>

                      {/* Finalize Button */}
                      <Button className="w-full h-16 text-lg font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02]">
                        Finalizar Venda
                        <CheckCircle2 className="w-6 h-6 ml-2" />
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium pt-2">
                        <Lock className="w-3.5 h-3.5" />
                        Transação Segura
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default SalesCreateFixture;
