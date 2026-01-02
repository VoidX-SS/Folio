'use client';

import { useState, useEffect } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import firebaseConfig from '@/firebase/config';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    const [firebaseInstances, setFirebaseInstances] = useState<any>(null);

    useEffect(() => {
        const instances = initializeFirebase(firebaseConfig);
        setFirebaseInstances(instances);
    }, []);

    if (!firebaseInstances) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div>Đang khởi tạo Firebase...</div>
            </div>
        );
    }

    return (
        <FirebaseProvider value={firebaseInstances}>
            {children}
        </FirebaseProvider>
    );
}
