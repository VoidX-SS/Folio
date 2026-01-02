'use client';
import type { CategorySlug, ContentItem } from '@/lib/types';
import { categories } from '@/lib/types';
import { NewItemDialog } from './new-item-dialog';

interface PageHeaderProps {
  categorySlug: CategorySlug;
  onAddItem: (item: ContentItem) => void;
}

export function PageHeader({ categorySlug, onAddItem }: PageHeaderProps) {
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
      <NewItemDialog categorySlug={categorySlug} onAddItem={onAddItem} />
    </header>
  );
}