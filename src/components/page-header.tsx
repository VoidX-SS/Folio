'use client';
import type { CategorySlug, KnowledgeEntry } from '@/lib/types';
import { categories } from '@/lib/types';
import Link from 'next/link';
import { Button } from './ui/button';

interface PageHeaderProps {
  categorySlug: CategorySlug;
}

export function PageHeader({ categorySlug }: PageHeaderProps) {
  const categoryInfo = categories[categorySlug];
  if (!categoryInfo) {
    return null;
  }

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {categoryInfo.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và xem tất cả các mục trong {categoryInfo.name.toLowerCase()}.
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
