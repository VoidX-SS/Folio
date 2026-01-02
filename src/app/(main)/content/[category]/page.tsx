'use client';
import { useState, use, useEffect } from 'react';
import type { CategorySlug } from '@/lib/types';
import { categories } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { ContentCard } from '@/components/content-card';
import { notFound } from 'next/navigation';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { deleteItem, createItem } from '@/firebase/firestore/api';
import type { ContentItem } from '@/lib/types';

interface CategoryPageProps {
  params: {
    category: CategorySlug;
  };
}

// A mock user ID for when Firebase Auth is not used.
const MOCK_USER_ID = 'local-user';

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const firestore = useFirestore();

  // Since we are not using Firebase Auth, we use a constant user ID.
  // In a real app with users, you would get this from your auth state.
  const userId = MOCK_USER_ID;

  const itemsQuery = useMemoFirebase(
    () =>
      firestore && userId
        ? query(
            collection(firestore, 'items'),
            where('category', '==', category),
            where('userId', '==', userId)
          )
        : null,
    [firestore, userId, category]
  );

  const { data: items, loading } = useCollection<ContentItem>(itemsQuery);

  if (!Object.keys(categories).includes(category)) {
    notFound();
  }

  const handleAddItem = (newItemData: Omit<ContentItem, 'id' | 'date' | 'userId'>) => {
    if (firestore && userId) {
        createItem(firestore, userId, newItemData);
    }
  };
  
  const handleDeleteItem = (id: string) => {
    if (firestore) {
        deleteItem(firestore, id);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
          <p className="text-muted-foreground">Đang tải nội dung...</p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Chưa có nội dung
          </h3>
          <p className="text-muted-foreground mt-2">
            Bắt đầu bằng cách thêm một mục mới.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} onDeleteItem={handleDeleteItem} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader categorySlug={category} onAddItem={handleAddItem} />
      {renderContent()}
    </div>
  );
}
