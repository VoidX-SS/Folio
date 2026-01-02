'use client';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { ContentItem } from '@/lib/types';

export function createItem(
  db: Firestore,
  userId: string,
  itemData: Omit<ContentItem, 'id' | 'date' | 'userId'>
) {
  const itemsCollection = collection(db, 'items');
  const newItem = {
    ...itemData,
    userId,
    date: serverTimestamp(),
  };

  addDoc(itemsCollection, newItem).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemsCollection.path,
      operation: 'create',
      requestResourceData: newItem,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function deleteItem(db: Firestore, itemId: string) {
  const itemRef = doc(db, 'items', itemId);
  deleteDoc(itemRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
