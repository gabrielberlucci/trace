import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Plus,
  MoreHorizontal,
  Upload,
  LayoutGrid,
  List,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const products = [
  {
    name: 'Enterprise Edge Server Node X-900',
    sku: 'TRC-SRV-900X',
    price: 2499.0,
    stock: 142,
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80',
  },
  {
    name: '48-Port Gigabit Managed Switch',
    sku: 'TRC-NSW-48P',
    price: 850.0,
    stock: 4,
    status: 'Low Stock',
    image:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80',
  },
  {
    name: 'Wi-Fi 6 Enterprise Access Point',
    sku: 'TRC-WAP-AX6',
    price: 320.0,
    stock: null,
    status: 'Draft',
    image:
      'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&q=80',
  },
  {
    name: '4K AI Dome Security Camera',
    sku: 'TRC-CAM-4K-D',
    price: 499.0,
    stock: 0,
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80',
  },
];

const getStatusBadge = (status: string) => {
  if (status === 'Active') {
    return (
      <div className="absolute top-3 right-3 bg-violet-100/90 dark:bg-violet-900/50 backdrop-blur-sm text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"></span>
        Active
      </div>
    );
  }
  if (status === 'Low Stock') {
    return (
      <div className="absolute top-3 right-3 bg-red-100/90 dark:bg-red-900/50 backdrop-blur-sm text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm border border-red-200 dark:border-red-800 z-20">
        <AlertTriangle className="w-3 h-3" />
        Low Stock
      </div>
    );
  }
  if (status === 'Draft') {
    return (
      <div className="absolute top-3 right-3 bg-slate-100/90 dark:bg-slate-800/50 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Draft
      </div>
    );
  }
  return null;
};

const ProductsPage = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-muted/40">
          <header className="flex h-14 items-center justify-between border-b bg-background px-6 lg:h-15">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border" />
              <h1 className="font-bold text-sm tracking-wider text-muted-foreground">
                TRACE ERP
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-8 space-y-6 mx-auto w-full">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Produtos
                </h1>
                <p className="text-muted-foreground">
                  Gerencie seu inventário, precificação e níveis de estoque.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="font-semibold gap-2 shadow-sm px-6"
                >
                  <Upload className="h-4 w-4" /> Exportar
                </Button>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold gap-2 shadow-md px-6">
                  <Plus className="h-4 w-4" /> Adicionar Produto
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-background border rounded-xl p-3 shadow-sm gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <Button
                  variant="default"
                  className="bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 rounded-full h-9 px-5 text-[13px] font-semibold border-none shrink-0"
                >
                  All Products
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-9 px-5 text-[13px] font-medium text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:bg-muted shrink-0"
                >
                  Active
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-9 px-5 text-[13px] font-medium text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:bg-muted shrink-0"
                >
                  Low Stock
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-9 px-5 text-[13px] font-medium text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:bg-muted shrink-0"
                >
                  Drafts
                </Button>
              </div>

              <div className="flex items-center gap-4 px-2">
                <div className="flex items-center text-sm font-semibold cursor-pointer hover:text-violet-600 transition-colors">
                  <List className="h-4 w-4 mr-2" /> Newest First
                </div>
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                  <div className="p-1.5 bg-white dark:bg-zinc-800 rounded-md shadow-sm text-violet-600 dark:text-violet-400">
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                  <div className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer">
                    <List className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-6 grid grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.sku}
                  className="bg-background rounded-2xl border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                >
                  {/* Image Container */}
                  <div className="h-56 relative bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                    {getStatusBadge(product.status)}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/40 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
                        <span className="bg-white dark:bg-zinc-900 text-foreground px-4 py-2 rounded-lg font-black text-xs tracking-[0.2em] uppercase shadow-lg border border-zinc-200 dark:border-zinc-800">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className={`object-contain h-full w-full transition-transform duration-500 group-hover:scale-105 ${product.stock === 0 ? 'opacity-40 grayscale' : ''}`}
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                      SKU: {product.sku}
                    </p>
                    <h3 className="font-bold text-[15px] leading-snug mb-5 flex-1 line-clamp-2 pr-4">
                      {product.name}
                    </h3>

                    <div className="mt-auto">
                      <p className="text-xs text-muted-foreground font-semibold mb-1.5">
                        In Stock:{' '}
                        <span
                          className={`${product.stock === 0 ? 'text-red-500' : product.stock !== null && product.stock < 10 ? 'text-red-500' : 'text-foreground'}`}
                        >
                          {product.stock === null ? '--' : product.stock}
                        </span>
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold tracking-tight">
                          $
                          {product.price.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-8">
              <span className="text-sm text-muted-foreground font-medium">
                Showing 1 to 4 of 24 products
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md text-muted-foreground"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  className="h-8 w-8 rounded-md bg-violet-600 hover:bg-violet-700 text-white p-0"
                >
                  1
                </Button>
                <Button variant="outline" className="h-8 w-8 rounded-md p-0">
                  2
                </Button>
                <Button variant="outline" className="h-8 w-8 rounded-md p-0">
                  3
                </Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md text-muted-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default ProductsPage;

