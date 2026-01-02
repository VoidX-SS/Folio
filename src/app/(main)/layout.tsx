'use client';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import { initializeFirebase, FirebaseProvider, UserProvider } from '@/firebase';
import firebaseConfig from '@/firebase/config';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebaseInstances, setFirebaseInstances] = useState<any>(null);

  useEffect(() => {
    const instances = initializeFirebase(firebaseConfig);
    setFirebaseInstances(instances);
  }, []);

  if (!firebaseInstances) {
    return <div>Đang tải...</div>; // Hoặc một component loading khác
  }

  return (
    <FirebaseProvider value={firebaseInstances}>
      <UserProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <MainSidebar />
            <SidebarInset>
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </UserProvider>
    </FirebaseProvider>
  );
}
