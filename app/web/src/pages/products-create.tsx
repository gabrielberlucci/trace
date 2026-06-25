import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productSchema } from '@app/shared';
import { createProduct, getSuppliers } from '@/api';
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
  Info,
  Tag,
  Truck,
  Lightbulb,
  Barcode,
  Save,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

type FormInput = z.input<typeof productSchema>;
type FormOutput = z.infer<typeof productSchema>;

const ProductsCreatePage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(productSchema),
  });

  const cost = watch('costPrice');
  const price = watch('salePrice');

  const margin =
    cost && price && price > 0
      ? (((price - cost) / cost) * 100).toFixed(2)
      : '--';

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await getSuppliers(1, '', 'Ativo');
        setSuppliers(res.data);
      } catch (e) {
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, []);

  const onSubmit = async (data: FormOutput) => {
    try {
      setIsSubmitting(true);
      await createProduct(data);
      toast.success('Produto criado com sucesso!');
      navigate({ to: '/product', search: { page: 1 } as never });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar produto');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseNumber = (v: string) => {
    if (v === '') return undefined;
    const num = Number(v.replace(',', '.'));
    return isNaN(num) ? undefined : num;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Breadcrumb & Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className="hover:text-violet-600 cursor-pointer font-medium">
            <Link to="/product" search={{ q: undefined, page: 1 }}>
              Produtos
            </Link>
          </span>
          <span>›</span>
          <span className="text-foreground font-semibold">Novo Cadastro</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Cadastrar Produto
            </h1>
            <p className="text-muted-foreground">
              Insira os detalhes técnicos e comerciais do novo item de
              inventário.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="font-semibold shadow-sm px-6 h-11 rounded-lg"
            >
              <Link to="/product" search={{ q: undefined, page: 1 }}>
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
              Salvar Produto
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-2 space-y-8">
          {/* Informações Principais */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Info className="h-5 w-5" />
                </div>
                Informações Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-foreground"
                >
                  Descrição do Produto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Ex: Cimento Portland CP II-Z 32 50kg"
                  className="h-11 rounded-lg"
                />
                {errors.description && (
                  <span className="text-xs text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      {...register('barcode')}
                      placeholder="0000000000000"
                      className="h-11 rounded-lg pl-12 pr-4"
                    />
                  </div>
                  {errors.barcode && (
                    <span className="text-xs text-red-500">
                      {errors.barcode.message}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="unity"
                    className="text-sm font-semibold text-foreground"
                  >
                    Unidade de Medida <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="unity"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="unity" className="h-11 rounded-lg">
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
                  {errors.unity && (
                    <span className="text-xs text-red-500">
                      {errors.unity.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Precificação e Estoque */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Tag className="h-5 w-5" />
                </div>
                Precificação e Estoque
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
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
                      {...register('costPrice', {
                        setValueAs: parseNumber,
                      })}
                      placeholder="0.00"
                      className="h-11 rounded-lg pl-12 text-right"
                    />
                  </div>
                  {errors.costPrice && (
                    <span className="text-xs text-red-500">
                      {errors.costPrice.message}
                    </span>
                  )}
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
                      {...register('salePrice', {
                        setValueAs: parseNumber,
                      })}
                      placeholder="0.00"
                      className="h-11 rounded-lg pl-12 text-right"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right mt-1.5">
                    Margem:{' '}
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">
                      {margin}%
                    </span>
                  </p>
                  {errors.salePrice && (
                    <span className="text-xs text-red-500">
                      {errors.salePrice.message}
                    </span>
                  )}
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
                    {...register('currentStock', {
                      setValueAs: parseNumber,
                    })}
                    placeholder="0"
                    className="h-11 rounded-lg"
                  />
                  {errors.currentStock && (
                    <span className="text-xs text-red-500">
                      {errors.currentStock.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Supplier */}
        <div className="space-y-8">
          {/* Fornecimento */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                Fornecimento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label
                  htmlFor="supplierId"
                  className="text-sm font-semibold text-foreground"
                >
                  Fornecedor Principal
                </Label>
                <Controller
                  control={control}
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
                        className="h-11 rounded-lg"
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
                {errors.supplierId && (
                  <span className="text-xs text-red-500">
                    {errors.supplierId.message}
                  </span>
                )}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default ProductsCreatePage;
