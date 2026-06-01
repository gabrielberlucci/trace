import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Download,
  AlertTriangle,
  TrendingUp,
  Users,
  ShoppingCart,
  Smartphone,
  Headphones,
  Camera,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Data for charts
const areaData = [
  { name: '01 Nov', total: 1200 },
  { name: '05 Nov', total: 2100 },
  { name: '10 Nov', total: 1800 },
  { name: '15 Nov', total: 2400 },
  { name: '20 Nov', total: 8420 },
  { name: '25 Nov', total: 3200 },
  { name: '30 Nov', total: 6800 },
];

const pieData = [
  { name: 'Credit Card', value: 65, color: '#8b5cf6' }, // violet-500
  { name: 'PIX', value: 25, color: '#3b82f6' }, // blue-500
  { name: 'Cash', value: 10, color: '#10b981' }, // emerald-500
];

const topProducts = [
  {
    id: 4421,
    name: 'Smart Series 4 - Titanium',
    category: 'Electronics',
    sold: 342,
    total: 'R$ 58.000,00',
    icon: Smartphone,
  },
  {
    id: 1209,
    name: 'AudioPro Wireless XL',
    category: 'Audio',
    sold: 218,
    total: 'R$ 32.400,00',
    icon: Headphones,
  },
  {
    id: 8872,
    name: 'OpticCam V2 Retro',
    category: 'Cameras',
    sold: 156,
    total: 'R$ 28.150,00',
    icon: Camera,
  },
];

const DashboardPage = () => {
  return (
    <>
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Dashboard
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Bem-vindo de volta,{' '}
                    <span className="font-semibold text-violet-500">
                      Alexandre
                    </span>
                    . Aqui está o resumo do seu negócio hoje.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/50 px-4 py-2 rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Last 30 Days</span>
                  </div>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </div>

              {/* KPIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-border/50 shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">
                        +12.5%
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Total Sales (Monthly)
                      </p>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">
                        R$ 124.500,00
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">
                        +5%
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Active Customers
                      </p>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">
                        1.240
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Pending Orders
                      </p>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">
                        42
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/30 shadow-sm bg-card relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="bg-red-500/10 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                        Attention
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Out of Stock Products
                      </p>
                      <h3 className="text-2xl font-bold text-red-500 tracking-tight">
                        8
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Area Chart */}
                <Card className="border-border/50 shadow-sm bg-card lg:col-span-8 flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">
                      Sales Revenue
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-violet-600"></div>
                      Current
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pt-4">
                    <div className="h-75 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={areaData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorTotal"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                            opacity={0.5}
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'white', fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))',
                            }}
                            itemStyle={{ color: '#8b5cf6' }}
                            formatter={(
                              value:
                                | number
                                | string
                                | readonly (number | string)[]
                                | undefined,
                            ) => [
                              `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                              'Revenue',
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#8b5cf6"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                            activeDot={{
                              r: 6,
                              fill: '#8b5cf6',
                              stroke: 'hsl(var(--background))',
                              strokeWidth: 3,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Donut Chart */}
                <Card className="border-border/50 shadow-sm bg-card lg:col-span-4 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Sales by Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="h-55 w-full relative mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm text-muted-foreground">
                          Total
                        </span>
                        <span className="text-xl font-bold text-foreground">
                          1.2k
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto space-y-3 pt-6">
                      {pieData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-muted-foreground">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Selling Products (Full width or centered) */}
              <Card className="border-border/50 shadow-sm bg-card">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                  <CardTitle className="text-base font-medium">
                    Top Selling Products
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-violet-500 font-semibold hover:text-violet-600 hover:bg-violet-500/10"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {topProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center shadow-sm">
                            <product.icon className="w-6 h-6 text-foreground/70" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {product.category} • ID: {product.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-violet-500 mb-0.5">
                            {product.sold} Sold
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            Total: {product.total}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
  );
};

export default DashboardPage;
