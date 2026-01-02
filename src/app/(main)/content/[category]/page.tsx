'use client';
import { useState, useEffect, use } from 'react';
import { mockData as initialMockData } from '@/lib/mock-data';
import type { CategorySlug, ContentItem } from '@/lib/types';
import { categories } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { ContentCard } from '@/components/content-card';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    category: CategorySlug;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    const categoryItems = initialMockData.filter(
      (item) => item.category === category
    );
    setItems(categoryItems);
  }, [category]);

  if (!Object.keys(categories).includes(category)) {
    notFound();
  }

  const handleAddItem = (newItem: ContentItem) => {
    setItems((prevItems) => [newItem, ...prevItems]);
  };
  
  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };


  return (
    <div className="flex flex-col gap-8">
      <PageHeader categorySlug={category} onAddItem={handleAddItem} />

      {items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} onDeleteItem={handleDeleteItem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Chưa có nội dung
          </h3>
          <p className="text-muted-foreground mt-2">
            Bắt đầu bằng cách thêm một mục mới.
          </p>
        </div>
      )}
    </div>
  );
}
