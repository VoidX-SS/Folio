'use client';

import { ContentEditorForm } from '@/components/content-editor-form';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { updateItem } from '@/firebase/firestore/api';
import { useRouter } from 'next/navigation';
import type { KnowledgeEntry } from '@/lib/types';
import { useState, use } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

// A constant user ID for the shared datastore.
const SHARED_USER_ID = 'shared-user-main-datastore';

export default function EditContentPage({ params }: { params: Promise<{ category: string; id: string }> }) {
    const { category, id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const docRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'users', SHARED_USER_ID, 'knowledgeEntries', id) : null,
        [firestore, id]
    );

    const { data: item, isLoading } = useDoc<KnowledgeEntry>(docRef);

    const handleSubmit = async (data: any) => {
        if (!firestore) return;

        setIsSubmitting(true);
        try {
            await updateItem(firestore, SHARED_USER_ID, id, data);
            router.push(`/content/${category}`);
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi cập nhật.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
    }

    if (!item) {
        return <div className="p-8 text-center text-muted-foreground">Không tìm thấy nội dung.</div>;
    }

    return (
        <ContentEditorForm
            categorySlug={category}
            initialData={item}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
