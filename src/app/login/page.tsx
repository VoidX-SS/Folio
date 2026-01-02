'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Folders } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const CORRECT_PIN = '690027';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (pin === CORRECT_PIN) {
      // In a real app, you'd use a more secure session management method.
      // For this simple case, we'll use localStorage.
      try {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/dashboard');
      } catch (error) {
        console.error("Could not access localStorage:", error);
        toast({
          variant: "destructive",
          title: "Lỗi Trình duyệt",
          description: "Không thể lưu trạng thái đăng nhập. Vui lòng bật cookie hoặc sử dụng trình duyệt khác.",
        });
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "PIN không chính xác",
        description: "Mã PIN bạn nhập không đúng. Vui lòng thử lại.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Folders className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Chào mừng đến với Digital Folio</CardTitle>
          <CardDescription>Nhập mã PIN để truy cập vào kho tri thức của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="pin"
              type="password"
              placeholder="******"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em]"
              aria-label="Mã PIN"
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang kiểm tra...' : 'Truy cập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
