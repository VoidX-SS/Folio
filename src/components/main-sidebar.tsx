"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { CategoryManager, iconComponents } from '@/components/category-manager';
import {
  BookOpen,
  Dices,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LifeBuoy,
  Folders,
  Users,
  Loader2,
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { DynamicCategory, IconName } from '@/lib/category-types';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  initializeDefaultCategories,
} from '@/firebase/firestore/categories';

// A constant user ID for the shared datastore
const SHARED_USER_ID = 'shared-user-main-datastore';

export function MainSidebar() {
  const pathname = usePathname();
  const firestore = useFirestore();
  const userId = SHARED_USER_ID;

  // Fetch categories from Firestore
  const categoriesQuery = useMemoFirebase(
    () =>
      firestore && userId
        ? query(
          collection(firestore, 'users', userId, 'categories'),
          orderBy('order', 'asc')
        )
        : null,
    [firestore, userId]
  );

  const { data: categories, isLoading } = useCollection<DynamicCategory>(categoriesQuery);

  // Initialize default categories if empty
  useEffect(() => {
    if (firestore && userId && categories && categories.length === 0 && !isLoading) {
      initializeDefaultCategories(firestore, userId);
    }
  }, [firestore, userId, categories, isLoading]);

  const handleCreateCategory = (data: { name: string; icon: string }) => {
    if (firestore && userId) {
      const maxOrder = categories?.reduce((max, c) => Math.max(max, c.order), -1) ?? -1;
      createCategory(firestore, userId, { ...data, order: maxOrder + 1 });
    }
  };

  const handleUpdateCategory = (id: string, data: { name?: string; icon?: string }) => {
    if (firestore && userId) {
      updateCategory(firestore, userId, id, data);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (firestore && userId) {
      deleteCategory(firestore, userId, id);
    }
  };

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
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center">
            <BookOpen className="mr-2" />
            Kho tri thức
          </SidebarGroupLabel>
          <SidebarMenu>
            {/* Dashboard - always first */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard' || pathname.startsWith('/dashboard')}
                tooltip="Bảng điều khiển"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Bảng điều khiển</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Loading state */}
            {isLoading && (
              <SidebarMenuItem>
                <div className="flex items-center gap-2 p-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Đang tải...</span>
                </div>
              </SidebarMenuItem>
            )}

            {/* Dynamic categories */}
            {categories?.map((category) => {
              const IconComp = iconComponents[category.icon as IconName] || FileText;
              const href = `/content/${category.slug}`;

              return (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(href)}
                    tooltip={category.name}
                  >
                    <Link href={href}>
                      <IconComp />
                      <span>{category.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center">
            <FlaskConical className="mr-2" />
            Playground
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/playground/random-choose')}
                tooltip="Chọn Ngẫu Nhiên"
              >
                <Link href="/playground/random-choose">
                  <Dices />
                  <span>Chọn Ngẫu Nhiên</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>


      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <CategoryManager
              categories={categories || []}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LifeBuoy />
              <span>Trợ giúp</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback><Users /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="font-medium text-sm">Kho dữ liệu chung</span>
            <span className="text-xs text-muted-foreground truncate">Mọi người đều có thể truy cập</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
