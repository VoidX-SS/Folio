'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Folders } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        Đang chuyển hướng...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Folders className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Chào mừng đến với Digital Folio</CardTitle>
          <CardDescription>Đăng nhập để bắt đầu quản lý kho tri thức của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleSignIn}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 512 244 512S0 403.3 0 261.8 106.3 11.8 244 11.8c67.6 0 127.8 27.3 171.6 71.6L364.5 169.8c-29.9-28.9-69.8-46.7-120.5-46.7-93.5 0-169.5 76-169.5 169.5s76 169.5 169.5 169.5c106.2 0 146-77.2 150.7-118.4H244V261.8h244z"></path></svg>
            Đăng nhập với Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
