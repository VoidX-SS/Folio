import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, FileText, FolderGit2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
      <header className="space-y-2">
        <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Bảng điều khiển
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Chào mừng đến với Digital Folio của bạn. Nơi lưu trữ và quản lý kiến thức, dự án và ý tưởng.
        </p>
      </header>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BookOpenIcon className="h-5 w-5" />
              </div>
              <CardTitle className="font-headline text-lg">Bắt đầu</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sử dụng thanh điều hướng bên trái để bắt đầu tạo và quản lý nội dung của bạn. Lưu trữ ghi chú, dự án, ý tưởng và hơn thế nữa.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-5 w-5" />
              </div>
              <CardTitle className="font-headline text-lg">Ghi lại Ý tưởng</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nhanh chóng nắm bắt những ý tưởng chợt lóe lên trong mục "Ý Tưởng". Đừng để bất kỳ suy nghĩ sáng tạo nào trôi qua.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <CardTitle className="font-headline text-lg">Quản lý Dự án</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tổ chức các dự án lớn và nhỏ của bạn. Theo dõi mã nguồn, tài liệu và các liên kết quan trọng ở cùng một nơi.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Playground Preview */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Playground
          </h2>
          <Link
            href="/playground/random-choose"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <Link href="/playground/random-choose">
            <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="2" />
                      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
                      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <CardTitle className="font-headline text-lg">Chọn Ngẫu Nhiên</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nhập danh sách và để công cụ chọn giúp bạn một kết quả ngẫu nhiên với tùy chỉnh tỷ lệ.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playground/daily-story">
            <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-headline text-lg">Xây Dựng Truyện</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mỗi ngày viết một phần truyện, AI viết tiếp phần tiếp theo. Cùng xây dựng câu chuyện!
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <Card className="mt-auto">
        <CardHeader className="pb-3">
          <CardTitle className="font-headline text-lg">Về Digital Folio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Đây là không gian cá nhân của bạn để lưu trữ kiến thức, sáng tạo và công việc. Mọi thứ bạn tạo ra sẽ được lưu trữ an toàn và có thể truy cập mọi lúc, mọi nơi. Hãy biến nơi đây thành một kho báu số của riêng bạn.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
