import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient } from '@tanstack/react-query';
import type { AuthContextType } from '@/context/auth.context';
import { Toaster } from '@/components/ui/sonner';

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}
