import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

import {
  useAuth,
  useUser,
  type AuthState,
  type UserState,
} from './auth/use-user';
import { FirebaseProvider, useFirebase, useFirebaseApp } from './provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

const initializeFirebase = (firebaseConfig: FirebaseOptions) => {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
    // @ts-ignore
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, `http://${host}:9099`, {
        disableWarnings: true,
      });
    }
    // @ts-ignore
    if (!firestore.emulatorConfig) {
      connectFirestoreEmulator(firestore, host, 8080);
    }
  }
  return { app, auth, firestore };
};

export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useUser,
  useCollection,
  useDoc,
  initializeFirebase,
};
export type { AuthState, UserState };
