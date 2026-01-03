'use client';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { DynamicCategory } from '@/lib/category-types';
import { defaultCategories } from '@/lib/category-types';

// Helper to generate a URL-safe slug from a name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

// Initialize default categories if they don't exist
export async function initializeDefaultCategories(
    db: Firestore,
    userId: string
): Promise<void> {
    const categoriesRef = collection(db, 'users', userId, 'categories');
    const snapshot = await getDocs(categoriesRef);

    if (snapshot.empty) {
        // Add default categories
        for (const category of defaultCategories) {
            await addDoc(categoriesRef, {
                ...category,
                dateCreated: serverTimestamp(),
                dateModified: serverTimestamp(),
            });
        }
    }
}

export function createCategory(
    db: Firestore,
    userId: string,
    categoryData: { name: string; icon: string; order?: number }
) {
    const categoriesRef = collection(db, 'users', userId, 'categories');
    const slug = generateSlug(categoryData.name) + '-' + Date.now().toString(36);

    const newCategory = {
        slug,
        name: categoryData.name,
        icon: categoryData.icon,
        order: categoryData.order ?? 999,
        isDefault: false,
        dateCreated: serverTimestamp(),
        dateModified: serverTimestamp(),
    };

    return addDoc(categoriesRef, newCategory).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: categoriesRef.path,
            operation: 'create',
            requestResourceData: newCategory,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });
}

export function updateCategory(
    db: Firestore,
    userId: string,
    categoryId: string,
    categoryData: Partial<{ name: string; icon: string; order: number }>
) {
    const categoryRef = doc(db, 'users', userId, 'categories', categoryId);

    const updatedCategory = {
        ...categoryData,
        dateModified: serverTimestamp(),
    };

    return updateDoc(categoryRef, updatedCategory).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: categoryRef.path,
            operation: 'update',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });
}

export function deleteCategory(
    db: Firestore,
    userId: string,
    categoryId: string
) {
    const categoryRef = doc(db, 'users', userId, 'categories', categoryId);

    return deleteDoc(categoryRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: categoryRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });
}
