'use client';
import { use } from 'react';
import { PageHeader } from '@/components/page-header';
import { ContentCard } from '@/components/content-card';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { deleteItem, pinItem } from '@/firebase/firestore/api';
import type { KnowledgeEntry } from '@/lib/types';
import type { DynamicCategory } from '@/lib/category-types';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// A constant user ID for the shared datastore.
const SHARED_USER_ID = 'shared-user-main-datastore';

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const firestore = useFirestore();
  const userId = SHARED_USER_ID;

  // Fetch category info
  const categoriesQuery = useMemoFirebase(
    () =>
      firestore && userId
        ? query(
          collection(firestore, 'users', userId, 'categories'),
          where('slug', '==', category)
        )
        : null,
    [firestore, userId, category]
  );

  const { data: categoryData } = useCollection<DynamicCategory>(categoriesQuery);
  const categoryInfo = categoryData?.[0] || null;

  // Fetch items for this category
  const itemsQuery = useMemoFirebase(
    () =>
      firestore && userId
        ? query(
          collection(firestore, 'users', userId, 'knowledgeEntries'),
          where('type', '==', category)
        )
        : null,
    [firestore, userId, category]
  );

  const { data: items, isLoading: loading } =
    useCollection<KnowledgeEntry>(itemsQuery);

  const handleDeleteItem = (id: string) => {
    if (firestore && userId) {
      deleteItem(firestore, userId, id);
    }
  };

  const handlePinItem = (id: string, pinned: boolean) => {
    if (firestore && userId) {
      pinItem(firestore, userId, id, pinned);
    }
  };

  // Sort items: pinned items first, then by original order
  const sortedItems = items
    ? [...items].sort((a, b) => {
      const aPinned = a.pinned === true ? 1 : 0;
      const bPinned = b.pinned === true ? 1 : 0;
      return bPinned - aPinned; // Pinned items come first
    })
    : [];

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
        {sortedItems.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onDeleteItem={handleDeleteItem}
            onPinItem={handlePinItem}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <PageHeader categorySlug={category} categoryInfo={categoryInfo} />
      {renderContent()}
    </div>
  );
}
