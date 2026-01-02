'use client';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { KnowledgeEntry } from '@/lib/types';

// Helper to remove undefined values from an object (Firestore doesn't accept undefined)
function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as Partial<T>;
}

export function createItem(
  db: Firestore,
  userId: string,
  itemData: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'>
) {
  const itemsCollection = collection(db, 'users', userId, 'knowledgeEntries');
  const cleanedData = removeUndefined(itemData);
  const newItem = {
    ...cleanedData,
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
export function updateItem(
  db: Firestore,
  userId: string,
  itemId: string,
  itemData: Partial<Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateModified' | 'userId'>>
) {
  const itemRef = doc(db, 'users', userId, 'knowledgeEntries', itemId);
  const cleanedData = removeUndefined(itemData);
  const updatedItem = {
    ...cleanedData,
    dateModified: serverTimestamp(),
  };

  // @ts-ignore
  updateDoc(itemRef, updatedItem).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: itemRef.path,
      operation: 'update',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
