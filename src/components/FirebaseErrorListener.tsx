'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

function formatError(error: FirestorePermissionError) {
  const parts = [
    `Operation: ${error.context.operation}`,
    `Path: ${error.context.path}`,
  ];

  if (error.context.requestResourceData) {
    parts.push(
      `Data: ${JSON.stringify(error.context.requestResourceData, null, 2)}`
    );
  }

  return parts.join('\n');
}

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on(
      'permission-error',
      (error: FirestorePermissionError) => {
        console.error('Firestore Permission Error:', error.message, error.context);
        toast({
          variant: 'destructive',
          title: 'Lỗi quyền truy cập Firestore',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{formatError(error)}</code>
            </pre>
          ),
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return null;
}
