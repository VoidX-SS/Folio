'use client';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <MainSidebar />
        <SidebarInset>
          <div className="flex-1 w-full overflow-x-hidden">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
