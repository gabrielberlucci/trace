import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getMe } from '@/api/users/me';

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }

    try {
      await context.queryClient.fetchQuery({
        queryKey: ['me'],
        queryFn: getMe,
        staleTime: 5 * 60 * 1000,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      context.auth.logout();
      throw redirect({ to: '/login' });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col bg-muted/20 min-h-screen">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
