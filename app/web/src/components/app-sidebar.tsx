import * as React from 'react';

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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserSideBar } from './ui/user-info';
import { Separator } from './ui/separator';
import { TraceLogo } from './trace-logo';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Cadastros',
      url: '#',
      icon: Database,
      items: [
        {
          title: 'Cliente',
          url: '#',
          isActive: true,
          icon: Users,
        },
        {
          title: 'Vendas',
          url: '#',
          icon: ShoppingCart,
        },
        {
          title: 'Fornecedor',
          url: '#',
          icon: Truck,
        },
        {
          title: 'Pagamentos',
          url: '#',
          icon: CreditCard,
        },
        {
          title: 'Produtos',
          url: '#',
          icon: Package,
        },
        {
          title: 'Usuários',
          url: '#',
          icon: UserCog,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-5 px-4">
        <div className="flex items-center gap-3">
          <TraceLogo className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none tracking-tight text-violet-600 dark:text-violet-400">Trace</span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground mt-1">Management System</span>
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
                        <SidebarMenuButton asChild isActive={subItem.isActive}>
                          <a href={subItem.url}>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </a>
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
            <AvatarFallback>USER</AvatarFallback>
          </Avatar>
          <UserSideBar name="Admin" email="admin@gmail.com" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
