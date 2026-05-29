import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function AppHeader() {
  return (
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
  );
}
