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
import { Info, Tag, Truck, Lightbulb, Barcode } from 'lucide-react';

const ProductsCreatePage = () => {
  return (
    <>
            {/* Breadcrumb & Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="hover:text-violet-600 cursor-pointer font-medium">
                  Produtos
                </span>
                <span>›</span>
                <span className="text-foreground font-semibold">
                  Novo Cadastro
                </span>
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
                    variant="outline"
                    className="font-semibold shadow-sm px-6 h-11 rounded-lg"
                  >
                    Cancelar
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-6 h-11 rounded-lg">
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
                        Descrição do Produto{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="description"
                        placeholder="Ex: Cimento Portland CP II-Z 32 50kg"
                        className="h-11 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label
                          htmlFor="barcode"
                          className="text-sm font-semibold text-foreground"
                        >
                          Código de Barras (EAN/GTIN)
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <Barcode className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input
                            id="barcode"
                            placeholder="0000000000000"
                            className="h-11 rounded-lg pl-12 pr-4"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="unity"
                          className="text-sm font-semibold text-foreground"
                        >
                          Unidade de Medida{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger id="unity" className="h-11 rounded-lg">
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UN">Unidade (UN)</SelectItem>
                            <SelectItem value="CX">Caixa (CX)</SelectItem>
                            <SelectItem value="KG">Quilograma (KG)</SelectItem>
                            <SelectItem value="MT">Metro (MT)</SelectItem>
                            <SelectItem value="PC">Peça (PC)</SelectItem>
                          </SelectContent>
                        </Select>
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
                          htmlFor="cost"
                          className="text-sm font-semibold text-foreground"
                        >
                          Preço de Custo (R$)
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <span className="text-muted-foreground font-semibold">
                              R$
                            </span>
                          </div>
                          <Input
                            id="cost"
                            placeholder="0,00"
                            className="h-11 rounded-lg pl-12 text-right"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="price"
                          className="text-sm font-semibold text-foreground"
                        >
                          Preço de Venda (R$){' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                            <span className="text-muted-foreground font-semibold">
                              R$
                            </span>
                          </div>
                          <Input
                            id="price"
                            placeholder="0,00"
                            className="h-11 rounded-lg pl-12 text-right"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1.5">
                          Margem:{' '}
                          <span className="text-violet-600 dark:text-violet-400 font-semibold">
                            --%
                          </span>
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="stock"
                          className="text-sm font-semibold text-foreground"
                        >
                          Estoque Atual <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="stock"
                          type="number"
                          placeholder="0"
                          className="h-11 rounded-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Supplier & Status */}
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
                        htmlFor="supplier"
                        className="text-sm font-semibold text-foreground"
                      >
                        Fornecedor Principal
                      </Label>
                      <Select>
                        <SelectTrigger
                          id="supplier"
                          className="h-11 rounded-lg"
                        >
                          <SelectValue placeholder="Selecione um fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Votorantim Cimentos</SelectItem>
                          <SelectItem value="2">Gerdau S.A.</SelectItem>
                          <SelectItem value="3">
                            TechSupply Informática
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 flex gap-4 border border-violet-100 dark:border-violet-900/50">
                      <div className="text-violet-600 dark:text-violet-400 shrink-0">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <p className="text-[13px] text-violet-800 dark:text-violet-300 leading-relaxed font-medium">
                        Vincular um fornecedor ajuda na automação de pedidos de
                        compra quando o estoque atingir o nível mínimo.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Status do Cadastro */}
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="pb-4 pt-6 px-8">
                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Status do Cadastro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 pt-0">
                    <div className="bg-violet-50/50 dark:bg-violet-900/10 rounded-xl p-5 flex items-center justify-between border border-violet-100 dark:border-violet-900/30">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400"></span>
                          <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                            Produto Ativo
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground pl-5">
                          Salvo agora
                        </span>
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

export default ProductsCreatePage;
