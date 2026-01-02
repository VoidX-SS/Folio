"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  FileText,
  FolderGit2,
  FolderGit,
  Wand2,
  Lightbulb,
  User,
  Archive,
  FlaskConical,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Folders,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bảng điều khiển' },
  { href: '/content/novels', icon: FileText, label: 'Tiểu thuyết & Truyện' },
  { href: '/content/large-projects', icon: FolderGit2, label: 'Dự Án Lớn' },
  { href: '/content/small-projects', icon: FolderGit, label: 'Dự Án Nhỏ' },
  { href: '/content/fun-code', icon: Wand2, label: 'Code Quậy Phá' },
  { href: '/content/ideas', icon: Lightbulb, label: 'Ý Tưởng' },
  { href: '/content/account', icon: User, label: 'Tài Khoản' },
  { href: '/content/exceptions', icon: Archive, label: 'Ngoại Lệ' },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/dashboard">
              <Folders className="text-primary" />
            </Link>
          </Button>
          <h1 className="font-headline text-lg font-semibold truncate">Digital Folio</h1>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center">
                <BookOpen className="mr-2"/>
                Kho tri thức
            </SidebarGroupLabel>
            <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                    <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                    tooltip={item.label}
                    >
                    {item.label}
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center">
                <FlaskConical className="mr-2"/>
                Playground
            </SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton disabled>Sắp ra mắt</SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>


      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton icon={<LifeBuoy />}>Trợ giúp</SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton icon={<Settings />}>Cài đặt</SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
         <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
                <span className="font-medium text-sm">Người dùng</span>
                <span className="text-xs text-muted-foreground">nguoidung@example.com</span>
            </div>
            <div className="ml-auto">
                <ThemeToggle />
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
