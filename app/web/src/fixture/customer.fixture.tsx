import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const SideBarFixture = () => {
  return (
    <h1>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </h1>
  );
};

export default SideBarFixture;
