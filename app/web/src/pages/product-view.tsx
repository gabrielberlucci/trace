import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSingleProduct,
  patchProduct,
  getSuppliers,
} from '@/api';
import {
  Loader2,
  Info,
  Tag,
  Truck,
  Lightbulb,
  Barcode,
  Save,
  XCircle,
  X,
  Edit2,
  ArrowLeft,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@app/shared';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { isAxiosError } from 'axios';

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

const InfoItem = ({
  label,
  value,
  icon: Icon,
  colSpan = 1,
}: {
  label: string;
  value?: string | number | null;
  icon?: any;
  colSpan?: number;
}) => (
  <div
    className={`flex flex-col space-y-1.5 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}
  >
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-violet-500" />}
      {label}
    </Label>
    <p className="font-medium text-foreground text-sm">
      {value !== undefined && value !== null && value !== '' ? (
        value
      ) : (
        <span className="text-muted-foreground/70 italic">Não informado</span>
      )}
    </p>
  </div>
);

const ProductViewPage = () => {
  const { id } = useParams({ from: '/_app/product_/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const {
    data: response,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getSingleProduct(Number(id)),
  });

  const form = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    values: response?.data ? {
      description: response.data.description,
      barcode: response.data.barcode,
      unity: response.data.unity,
      currentStock: response.data.currentStock,
      costPrice: response.data.costPrice,
      salePrice: response.data.salePrice,
      supplierId: response.data.supplierId || undefined,
    } : undefined,
  });

  const { errors, dirtyFields } = form.formState;
  const cost = form.watch('costPrice');
  const price = form.watch('salePrice');

  const margin =
    cost && price && price > 0
      ? (((price - cost) / cost) * 100).toFixed(2)
      : '--';

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await getSuppliers(1, '', 'Ativo');
        if (res?.data) {
          setSuppliers(res.data);
        }
      } catch (e) {
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, []);

  const mutation = useMutation({
    mutationFn: (data: Partial<ProductFormOutput>) =>
      patchProduct(Number(id), data as any),
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          Object.entries(data.fieldErrors).forEach(([field, messages]: [string, any]) => {
            form.setError(field as any, { type: 'server', message: messages[0] });
          });
          toast.error('Erro de validação, verifique os campos destacados.');
          return;
        }
        if (data.formErrors && data.formErrors.length > 0) {
          toast.error(data.formErrors[0]);
          return;
        }
      }
      toast.error(err.message || 'Erro ao atualizar produto');
    },
  });

  const onSubmit = (data: ProductFormOutput) => {
    if (Object.keys(dirtyFields).length === 0) {
      toast.info('Nenhuma alteração foi feita.');
      setIsEditing(false);
      return;
    }

    const patchData: any = {};
    for (const key of Object.keys(dirtyFields)) {
      patchData[key] = (data as any)[key];
    }

    mutation.mutate(patchData);
  };

  const onFormError = () => {
    toast.error('Erro de validação, verifique os campos destacados.');
  };

  const parseNumber = (v: string) => {
    if (v === '') return undefined;
    const num = Number(String(v).replace(',', '.'));
    return isNaN(num) ? undefined : num;
  };

  const getInputClassName = (fieldName: keyof ProductFormInput, baseClass: string = 'h-11 rounded-lg') =>
    cn(
      baseClass,
      errors[fieldName] && 'border-red-500 focus-visible:ring-red-500'
    );

  const renderError = (fieldName: keyof ProductFormInput) => {
    const error = errors[fieldName];
    if (!error) return null;
    return <span className="text-red-500 text-xs mt-1 block">{error.message as string}</span>;
  };

  if (isFetching && !response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Carregando dados do produto...
        </p>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/50 p-8">
        <XCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
          Produto não encontrado
        </h3>
        <p className="text-red-600/80 dark:text-red-400/80 mb-4 text-center max-w-md">
          Não foi possível carregar os dados deste produto.
        </p>
        <Button asChild variant="outline">
          <Link to="/product" search={{ page: 1 }}>
            Voltar para a lista
          </Link>
        </Button>
      </div>
    );
  }

  const product = response.data;
  const supplierName = product.supplier?.name || null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-10 w-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link to="/product" search={{ page: 1 }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Detalhes do Produto
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              ID: <span className="font-medium text-foreground">{product.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 flex-1 sm:flex-none"
                onClick={() => {
                  form.reset();
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 flex-1 sm:flex-none"
                disabled={mutation.isPending}
                onClick={form.handleSubmit(onSubmit, onFormError)}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg gap-2 w-full sm:w-auto"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
              Editar Produto
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Info className="h-5 w-5 text-violet-500" /> Informações Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <InfoItem
                      label="Descrição do Produto"
                      value={product.description}
                      colSpan={2}
                    />
                    <InfoItem
                      label="Código de Barras (EAN/GTIN)"
                      value={product.barcode}
                      icon={Barcode}
                    />
                    <InfoItem
                      label="Unidade de Medida"
                      value={product.unity}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-foreground"
                      >
                        Descrição do Produto <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="description"
                        {...form.register('description')}
                        placeholder="Ex: Cimento Portland CP II-Z 32 50kg"
                        className={getInputClassName('description')}
                      />
                      {renderError('description')}
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="barcode"
                        className="text-sm font-semibold text-foreground"
                      >
                        Código de Barras (EAN/GTIN){' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <Barcode className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          id="barcode"
                          {...form.register('barcode')}
                          placeholder="0000000000000"
                          className={getInputClassName('barcode', 'h-11 rounded-lg pl-12 pr-4')}
                        />
                      </div>
                      {renderError('barcode')}
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="unity"
                        className="text-sm font-semibold text-foreground"
                      >
                        Unidade de Medida <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        control={form.control}
                        name="unity"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="unity" className={getInputClassName('unity')}>
                              <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UN">Unidade (UN)</SelectItem>
                              <SelectItem value="CX">Caixa (CX)</SelectItem>
                              <SelectItem value="KG">Quilograma (KG)</SelectItem>
                              <SelectItem value="MT">Metro (MT)</SelectItem>
                              <SelectItem value="PC">Peça (PC)</SelectItem>
                              <SelectItem value="CM">Centímetro (CM)</SelectItem>
                              <SelectItem value="MM">Milímetro (MM)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {renderError('unity')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Tag className="h-5 w-5 text-violet-500" /> Precificação e Estoque
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <InfoItem
                      label="Preço de Custo (R$)"
                      value={`R$ ${Number(product.costPrice).toFixed(2)}`}
                    />
                    <InfoItem
                      label="Preço de Venda (R$)"
                      value={`R$ ${Number(product.salePrice).toFixed(2)}`}
                    />
                    <InfoItem
                      label="Estoque Atual"
                      value={product.currentStock}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="costPrice"
                        className="text-sm font-semibold text-foreground"
                      >
                        Preço de Custo (R$) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <span className="text-muted-foreground font-semibold">
                            R$
                          </span>
                        </div>
                        <Input
                          id="costPrice"
                          {...form.register('costPrice', {
                            setValueAs: parseNumber,
                          })}
                          placeholder="0.00"
                          className={getInputClassName('costPrice', 'h-11 rounded-lg pl-12 text-right')}
                        />
                      </div>
                      {renderError('costPrice')}
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="salePrice"
                        className="text-sm font-semibold text-foreground"
                      >
                        Preço de Venda (R$) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                          <span className="text-muted-foreground font-semibold">
                            R$
                          </span>
                        </div>
                        <Input
                          id="salePrice"
                          {...form.register('salePrice', {
                            setValueAs: parseNumber,
                          })}
                          placeholder="0.00"
                          className={getInputClassName('salePrice', 'h-11 rounded-lg pl-12 text-right')}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right mt-1.5">
                        Margem:{' '}
                        <span className="text-violet-600 dark:text-violet-400 font-semibold">
                          {margin}%
                        </span>
                      </p>
                      {renderError('salePrice')}
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="currentStock"
                        className="text-sm font-semibold text-foreground"
                      >
                        Estoque Atual <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="currentStock"
                        type="number"
                        {...form.register('currentStock', {
                          setValueAs: parseNumber,
                        })}
                        placeholder="0"
                        className={getInputClassName('currentStock')}
                      />
                      {renderError('currentStock')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5 text-violet-500" /> Fornecimento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {!isEditing ? (
                  <InfoItem
                    label="Fornecedor Principal"
                    value={supplierName}
                  />
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label
                        htmlFor="supplierId"
                        className="text-sm font-semibold text-foreground"
                      >
                        Fornecedor Principal
                      </Label>
                      <Controller
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                          <Select
                            onValueChange={(val) =>
                              field.onChange(val === 'none' ? undefined : Number(val))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <SelectTrigger
                              id="supplierId"
                              className={getInputClassName('supplierId')}
                            >
                              <SelectValue placeholder="Selecione um fornecedor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              {suppliers.map((sup) => (
                                <SelectItem key={sup.id} value={sup.id.toString()}>
                                  {sup.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {renderError('supplierId')}
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 flex gap-4 border border-violet-100 dark:border-violet-900/50">
                      <div className="text-violet-600 dark:text-violet-400 shrink-0">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <p className="text-[13px] text-violet-800 dark:text-violet-300 leading-relaxed font-medium">
                        Vincular um fornecedor ajuda na automação de pedidos de compra
                        quando o estoque atingir o nível mínimo.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductViewPage;
