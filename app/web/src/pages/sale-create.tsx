import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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
  ShoppingCart,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getProducts,
  getCustomers,
  getPaymentMethods,
  createSale,
  getMe,
} from '@/api';
import type {
  PaginatedProductsData,
  PaginatedCustomerData,
  PaginatedPaymentMethodsData,
  UserMeResponse,
} from '@/types';
import { useNavigate } from '@tanstack/react-router';

// Helper icons mapping for payment types
const PaymentIcons: Record<string, React.ElementType> = {
  PIX: Smartphone,
  CREDITO: CreditCard,
  DEBITO: CreditCard,
  DINHEIRO: Banknote,
  POS: CreditCard,
  TEF: CreditCard,
  OUTRO: Banknote,
};

type CartItem = PaginatedProductsData & { qty: number };

const SalesCreatePage = () => {
  const navigate = useNavigate();

  // --- UI State ---
  const [searchFocused, setSearchFocused] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data State ---
  // Customers
  const [customers, setCustomers] = useState<PaginatedCustomerData[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] =
    useState<PaginatedCustomerData | null>(null);

  // Products
  const [products, setProducts] = useState<PaginatedProductsData[]>([]);
  const [productSearch, setProductSearch] = useState('');

  // Payments
  const [paymentMethods, setPaymentMethods] = useState<
    PaginatedPaymentMethodsData[]
  >([]);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cashier
  const [cashier, setCashier] = useState<UserMeResponse | null>(null);

  // --- Effects ---
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getPaymentMethods(1, undefined, 'Ativo');
        if (res?.data) {
          setPaymentMethods(res.data);
          if (res.data.length > 0) {
            setSelectedPayment(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch payment methods', err);
      }
    };
    fetchPayments();

    const fetchMe = async () => {
      try {
        const user = await getMe();
        setCashier(user);
      } catch (err) {
        console.error('Failed to fetch logged in user', err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerSearch.length < 2) {
        if (!customerSearch) setCustomers([]);
        return;
      }
      try {
        const res = await getCustomers(1, customerSearch, 'Ativo');
        if (res?.data) {
          setCustomers(res.data);
        }
      } catch (e) {
        setCustomers([]);
      }
    };
    const timer = setTimeout(fetchCustomers, 600);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productSearch) {
        setProducts([]);
        return;
      }
      try {
        const res = await getProducts(1, productSearch);
        if (res?.data) {
          setProducts(res.data);
        }
      } catch (e) {
        setProducts([]);
      }
    };
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // --- Handlers ---
  const handleAddProduct = (product: PaginatedProductsData) => {
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
    setProductSearch('');
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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      (event.target as HTMLInputElement).blur();
      setSearchFocused(false);
    } else if (event.key === 'Enter') {
      if (products.length === 1) {
        handleAddProduct(products[0]);
      }
    }
  };

  const handleFinalizeSale = async () => {
    if (cartItems.length === 0) {
      toast.error('O carrinho está vazio');
      return;
    }
    if (!selectedCustomer) {
      toast.error('Selecione um cliente para a venda');
      return;
    }
    if (!selectedPayment) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        document: selectedCustomer?.document || null,
        cashier: cashier?.id || 1, // Fallback para 1 caso o getMe falhe
        payment: selectedPayment,
        items: cartItems.map((item) => ({
          barcode: item.barcode,
          quantity: item.qty,
        })),
      };

      // @ts-expect-error backend expect these fields correctly matching our payload shape
      await createSale(payload);

      toast.success('Venda finalizada com sucesso!');
      navigate({ to: '/sale', search: { page: 1 } as never });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Erro ao finalizar venda');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.salePrice * item.qty,
    0,
  );

  // Tax mock if necessary, set to 0 for now
  const tax = 0;
  const total = subtotal + tax;

  return (
    <>
      <div className="max-w-350 mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Nova Venda
            </h2>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Terminal PDV #04 • Caixa:{' '}
              {cashier ? cashier.name : 'Carregando...'}
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
              onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
            >
              <UserPlus className="w-4 h-4" />
              {selectedCustomer
                ? `Cliente: ${selectedCustomer.name}`
                : 'Atribuir Cliente'}
            </Button>

            {customerDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-2 border-b border-border/50 bg-muted/20">
                  <Input
                    placeholder="Buscar cliente (CPF/Nome)..."
                    className="h-9 bg-background text-xs border-border/50"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="p-1 max-h-50 overflow-y-auto">
                  {customers.length === 0 && customerSearch.length > 1 ? (
                    <div className="p-3 text-xs text-center text-muted-foreground">
                      Nenhum cliente encontrado.
                    </div>
                  ) : (
                    customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="px-3 py-2 text-sm hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerDropdownOpen(false);
                          setCustomerSearch('');
                        }}
                      >
                        <p className="font-semibold text-foreground">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.document}
                        </p>
                      </div>
                    ))
                  )}
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
            <div className="relative z-40">
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
                  placeholder="Bipar código de barras ou buscar por nome..."
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-12"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                />
                {searchFocused && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2 h-8 px-2 text-xs text-muted-foreground"
                    onClick={() => {
                      setSearchFocused(false);
                      setProductSearch('');
                    }}
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

              {/* Rich Search Dropdown */}
              {searchFocused && productSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Resultados da Busca
                    </span>
                  </div>
                  <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                    {products.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Nenhum produto encontrado.
                      </div>
                    ) : (
                      products.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-violet-500/10',
                          )}
                          onClick={() => handleAddProduct(item)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center border border-border/50">
                              <Package className="w-5 h-5 text-foreground/70" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-foreground">
                                {item.description}
                              </h4>
                              <p className="text-xs text-muted-foreground font-mono">
                                {item.barcode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span
                                className={cn(
                                  'text-xs font-bold px-2 py-1 rounded-full',
                                  item.currentStock > 10
                                    ? 'bg-emerald-500/10 text-emerald-600'
                                    : 'bg-red-500/10 text-red-600',
                                )}
                              >
                                Estoque: {item.currentStock} {item.unity}
                              </span>
                            </div>
                            <div className="font-bold text-foreground min-w-25 text-right">
                              R${' '}
                              {item.salePrice.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
                      Utilize a barra de busca acima ou bipe um código de barras
                      para adicionar itens à venda.
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
                            <Package className="w-6 h-6 text-foreground/70" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                              {item.description}
                            </h4>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              {item.barcode}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-3 flex justify-center">
                          <div className="flex items-center bg-background border border-border/50 rounded-lg p-1 w-30">
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                              onClick={() => handleUpdateQty(item.id, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="flex-1 text-center font-bold text-sm">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                              onClick={() => handleUpdateQty(item.id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-right font-medium text-sm text-foreground/80">
                          R${' '}
                          {item.salePrice.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </div>

                        <div className="col-span-2 flex items-center justify-end gap-2 text-right font-bold text-sm text-foreground">
                          <span>
                            R${' '}
                            {(item.salePrice * item.qty).toLocaleString(
                              'pt-BR',
                              { minimumFractionDigits: 2 },
                            )}
                          </span>
                          <button
                            type="button"
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
                <div className="relative">
                  <span className="text-sm font-semibold text-foreground mb-2 block">
                    Forma de Pagamento
                  </span>
                  <Button
                    variant={selectedPayment ? 'default' : 'outline'}
                    className={cn(
                      'w-full justify-start shadow-sm gap-3 font-semibold transition-all h-12',
                      selectedPayment
                        ? 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600'
                        : 'bg-card border-border/50 hover:bg-muted/50 text-muted-foreground',
                    )}
                    onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                  >
                    {selectedPayment ? (
                      <>
                        {(() => {
                          const pm = paymentMethods.find(
                            (p) => p.id === selectedPayment,
                          );
                          const Icon = pm
                            ? PaymentIcons[pm.type] || Banknote
                            : Banknote;
                          return (
                            <>
                              <Icon className="w-5 h-5" />
                              <span className="truncate flex-1 text-left">
                                {pm?.description || 'Desconhecido'}
                              </span>
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <>
                        <Banknote className="w-5 h-5" />
                        <span className="truncate flex-1 text-left">
                          Selecionar Forma de Pagamento
                        </span>
                      </>
                    )}
                  </Button>

                  {paymentDropdownOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
                      <div className="p-2 border-b border-border/50 bg-muted/20">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                          Selecione o Pagamento
                        </span>
                      </div>
                      <div className="p-1 max-h-50 overflow-y-auto">
                        {paymentMethods.length === 0 ? (
                          <div className="p-3 text-xs text-center text-muted-foreground">
                            Nenhum método encontrado.
                          </div>
                        ) : (
                          paymentMethods.map((pm) => {
                            const Icon = PaymentIcons[pm.type] || Banknote;
                            return (
                              <div
                                key={pm.id}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/50 rounded-md cursor-pointer transition-colors',
                                  selectedPayment === pm.id &&
                                    'bg-violet-500/10 text-violet-600',
                                )}
                                onClick={() => {
                                  setSelectedPayment(pm.id);
                                  setPaymentDropdownOpen(false);
                                }}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="font-semibold flex-1">
                                  {pm.description}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Finalize Button */}
                <Button
                  onClick={handleFinalizeSale}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full h-16 text-lg font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02]"
                >
                  {isSubmitting ? 'Processando...' : 'Finalizar Venda'}
                  {!isSubmitting && <CheckCircle2 className="w-6 h-6 ml-2" />}
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
    </>
  );
};

export default SalesCreatePage;
