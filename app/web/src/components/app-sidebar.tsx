import * as React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import type { FileRoutesByFullPath } from '@/routeTree.gen';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/users/me';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  ChevronRightIcon,
  Users,
  ShoppingCart,
  Truck,
  CreditCard,
  Package,
  UserCog,
  Database,
  LayoutDashboard,
  ReceiptText,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserSideBar } from './ui/user-info';
import { Separator } from './ui/separator';
import { TraceLogo } from './trace-logo';

type ValidPath = keyof FileRoutesByFullPath;

type NavSubItem = {
  title: string;
  url: ValidPath;
  icon?: React.ElementType;
};

type NavGroup = {
  title: string;
  url: string;
  icon?: React.ElementType;
  items: NavSubItem[];
};

// This is sample data.
const data: { navMain: NavGroup[] } = {
  navMain: [
    {
      title: 'Menu Principal',
      url: '#',
      icon: Database,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Vendas / PDV',
          url: '/sale-create',
          icon: ShoppingCart,
        },
        {
          title: 'Histórico de Vendas',
          url: '/sale',
          icon: ReceiptText,
        },
      ],
    },
    {
      title: 'Cadastros',
      url: '#',
      icon: Database,
      items: [
        {
          title: 'Cliente',
          url: '/customer',
          icon: Users,
        },
        {
          title: 'Fornecedor',
          url: '/supplier',
          icon: Truck,
        },
        {
          title: 'Produtos',
          url: '/product',
          icon: Package,
        },
        {
          title: 'Pagamentos',
          url: '/payment',
          icon: CreditCard,
        },
        {
          title: 'Usuários',
          url: '/user',
          icon: UserCog,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe });

  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-5 px-4">
        <div className="flex items-center gap-3">
          <TraceLogo className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none tracking-tight text-violet-600 dark:text-violet-400">
              Trace
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground mt-1">
              Sistema ERP
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}{' '}
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={currentPath === subItem.url}
                        >
                          <Link to={subItem.url}>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />

      <Separator />

      <SidebarFooter>
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-users-vector-icon-png-image_3725294.jpg" />
            <AvatarFallback>
              {user?.username?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
          <UserSideBar name={user?.name || 'Carregando...'} email="" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
