import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col w-full">
          {/* Mobile Header with Trigger */}
          <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:hidden">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger className="text-muted-foreground">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-bold neon-text">TON MINING</h1>
            </div>
          </header>

          {/* Desktop Trigger - Hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="flex h-14 items-center gap-4 px-4">
                <SidebarTrigger className="text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
