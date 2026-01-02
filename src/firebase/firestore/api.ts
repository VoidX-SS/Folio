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
import type { KnowledgeEntry } from '@/lib/types';

export function createItem(
  db: Firestore,
  userId: string,
  itemData: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'>
) {
  const itemsCollection = collection(db, 'users', userId, 'knowledgeEntries');
  const newItem = {
    ...itemData,
    userId,
    dateCreated: serverTimestamp(),
    dateModified: serverTimestamp(),
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

export function deleteItem(db: Firestore, userId: string, itemId: string) {
  const itemRef = doc(db, 'users', userId, 'knowledgeEntries', itemId);
  deleteDoc(itemRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
