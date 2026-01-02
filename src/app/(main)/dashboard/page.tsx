import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, FileText, FolderGit2 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Bảng điều khiển
        </h1>
        <p className="text-muted-foreground mt-1">
          Chào mừng đến với Digital Folio của bạn.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpenIcon className="h-6 w-6" />
              Bắt đầu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sử dụng thanh điều hướng bên trái để bắt đầu tạo và quản lý nội dung của bạn. Lưu trữ ghi chú, dự án, ý tưởng và hơn thế nữa.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb className="h-6 w-6" />
              Ghi lại Ý tưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nhanh chóng nắm bắt những ý tưởng chợt lóe lên trong mục "Ý Tưởng". Đừng để bất kỳ suy nghĩ sáng tạo nào trôi qua.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FolderGit2 className="h-6 w-6" />
              Quản lý Dự án
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tổ chức các dự án lớn và nhỏ của bạn. Theo dõi mã nguồn, tài liệu và các liên kết quan trọng ở cùng một nơi.
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Về Digital Folio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
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
