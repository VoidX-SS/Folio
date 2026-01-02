import type { CategorySlug } from '@/lib/types';
import { categories } from '@/lib/types';
import { NewItemDialog } from './new-item-dialog';

interface PageHeaderProps {
  categorySlug: CategorySlug;
}

export function PageHeader({ categorySlug }: PageHeaderProps) {
  const categoryInfo = categories[categorySlug];
  if (!categoryInfo) {
    return null;
  }

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {categoryInfo.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và xem tất cả các mục trong {categoryInfo.name.toLowerCase()}.
        </p>
      </div>
      <NewItemDialog categorySlug={categorySlug} />
    </header>
  );
}
