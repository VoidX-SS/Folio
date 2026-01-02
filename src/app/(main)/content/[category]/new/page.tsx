'use client';

import { ContentEditorForm } from '@/components/content-editor-form';
import { useFirestore } from '@/firebase';
import { createItem } from '@/firebase/firestore/api';
import { useRouter } from 'next/navigation';
import type { CategorySlug } from '@/lib/types';
import { useState, use } from 'react';

// A constant user ID for the shared datastore.
const SHARED_USER_ID = 'shared-user-main-datastore';

export default function NewContentPage({ params }: { params: Promise<{ category: CategorySlug }> }) {
    const { category } = use(params);
    const firestore = useFirestore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        if (!firestore) return;

        setIsSubmitting(true);
        try {
            await createItem(firestore, SHARED_USER_ID, {
                ...data,
                type: category,
            });
            router.push(`/content/${category}`);
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi tạo mới.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ContentEditorForm
            categorySlug={category}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
