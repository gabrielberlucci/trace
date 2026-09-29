import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Barcode,
  Plus,
  Minus,
  CheckCircle2,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProducts, createStockAdjustment, getMe } from '@/api';
import type { PaginatedProductsData, UserMeResponse } from '@/types';
import { useNavigate } from '@tanstack/react-router';

type CartItem = PaginatedProductsData & {
  qty: number;
  type: 'AJUSTE_ENTRADA' | 'AJUSTE_SAIDA';
};

const StockAdjustmentPage = () => {
  const navigate = useNavigate();

  // --- UI State ---
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data State ---
  const [products, setProducts] = useState<PaginatedProductsData[]>([]);
  const [productSearch, setProductSearch] = useState('');

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // User
  const [user, setUser] = useState<UserMeResponse | null>(null);

  // --- Effects ---
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const u = await getMe();
        setUser(u);
      } catch (err) {
        console.error('Failed to fetch logged in user', err);
      }
    };
    fetchMe();
  }, []);

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
      setCartItems([
        ...cartItems,
        { ...product, qty: 1, type: 'AJUSTE_ENTRADA' },
      ]);
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

  const handleUpdateType = (
    id: number,
    type: 'AJUSTE_ENTRADA' | 'AJUSTE_SAIDA',
  ) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, type };
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

  const handleFinalizeAdjustment = async () => {
    if (cartItems.length === 0) {
      toast.error('Adicione produtos para ajustar');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({
          barcode: item.barcode,
          quantity: item.qty,
          type: item.type,
        })),
      };

      await createStockAdjustment(payload);

      toast.success('Ajuste de estoque realizado com sucesso!');
      navigate({ to: '/stock-adjustments', search: { page: 1 } as never });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Erro ao realizar ajuste');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-350 mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Package className="w-8 h-8 text-violet-600" /> Ajuste de Estoque
            </h2>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Realize entradas e saídas manuais do estoque • Usuário:{' '}
              {user ? user.name : 'Carregando...'}
            </p>
          </div>
        </div>

        {/* Main Layout */}
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
                  <Search className="w-6 h-6" />
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
                                Estoque atual: {item.currentStock} {item.unity}
                              </span>
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
                  <div className="col-span-4 text-center">Operação</div>
                  <div className="col-span-3 text-center">Quantidade</div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
                    <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                      <Package className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Nenhum produto selecionado
                    </h3>
                    <p className="text-muted-foreground max-w-75">
                      Utilize a barra de busca acima para adicionar os itens que
                      deseja ajustar.
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
                            <span className="text-xs font-medium text-muted-foreground">
                              Estoque atual: {item.currentStock}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-4 flex justify-center">
                          <div className="flex p-1 bg-muted rounded-lg border border-border/50">
                            <button
                              type="button"
                              className={cn(
                                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all',
                                item.type === 'AJUSTE_ENTRADA'
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'text-muted-foreground hover:bg-background',
                              )}
                              onClick={() =>
                                handleUpdateType(item.id, 'AJUSTE_ENTRADA')
                              }
                            >
                              <ArrowDownToLine className="w-4 h-4" />
                              Entrada
                            </button>
                            <button
                              type="button"
                              className={cn(
                                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all',
                                item.type === 'AJUSTE_SAIDA'
                                  ? 'bg-red-500 text-white shadow-sm'
                                  : 'text-muted-foreground hover:bg-background',
                              )}
                              onClick={() =>
                                handleUpdateType(item.id, 'AJUSTE_SAIDA')
                              }
                            >
                              <ArrowUpFromLine className="w-4 h-4" />
                              Saída
                            </button>
                          </div>
                        </div>

                        <div className="col-span-3 flex items-center justify-between">
                          <div className="flex items-center bg-background border border-border/50 rounded-lg p-1 w-32">
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
                          <button
                            type="button"
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
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

          {/* Lado Direito - Summary (4 cols) */}
          <div className="lg:col-span-4">
            <Card className="border-border/50 shadow-md bg-card sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">
                  Resumo do Ajuste
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">
                      Total de Itens Listados
                    </span>
                    <span className="font-bold text-foreground">
                      {cartItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">
                      Entradas Programadas
                    </span>
                    <span className="font-bold text-emerald-600">
                      {
                        cartItems.filter((i) => i.type === 'AJUSTE_ENTRADA')
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">
                      Saídas Programadas
                    </span>
                    <span className="font-bold text-red-600">
                      {
                        cartItems.filter((i) => i.type === 'AJUSTE_SAIDA')
                          .length
                      }
                    </span>
                  </div>
                </div>

                <div className="h-px w-full bg-border/50 my-6" />

                <div className="bg-muted/50 p-4 rounded-xl mb-6">
                  <p className="text-xs text-muted-foreground text-center">
                    Atenção: Ao confirmar, as quantidades indicadas serão
                    adicionadas ou subtraídas do estoque atual imediatamente.
                    Esta operação irá gerar uma movimentação de estoque
                    (Kardex).
                  </p>
                </div>

                {/* Finalize Button */}
                <Button
                  onClick={handleFinalizeAdjustment}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full h-16 text-lg font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02]"
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar Ajuste'}
                  {!isSubmitting && <CheckCircle2 className="w-6 h-6 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockAdjustmentPage;
