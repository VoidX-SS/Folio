'use client';
import type { DynamicCategory } from '@/lib/category-types';
import Link from 'next/link';
import { Button } from './ui/button';

interface PageHeaderProps {
  categorySlug: string;
  categoryInfo?: DynamicCategory | null;
}

export function PageHeader({ categorySlug, categoryInfo }: PageHeaderProps) {
  const displayName = categoryInfo?.name || categorySlug;

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {displayName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và xem tất cả các mục trong {displayName.toLowerCase()}.
        </p>
      </div>
      <Button asChild>
        <Link href={`/content/${categorySlug}/new`}>
          Thêm mới
        </Link>
      </Button>
    </header>
  );
}
