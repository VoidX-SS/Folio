'use client';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { useEffect } from 'react';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, loading]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Đang tải ứng dụng...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <MainSidebar />
        <SidebarInset>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
