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
import { Loader2 } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Đang tải nội dung...</p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Chưa có nội dung
          </h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Bắt đầu bằng cách thêm một mục mới vào danh mục này.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
      <PageHeader categorySlug={category} categoryInfo={categoryInfo} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
