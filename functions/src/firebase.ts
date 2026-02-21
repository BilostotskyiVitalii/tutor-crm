import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

if (!getApps().length) {
  admin.initializeApp();
}

export { admin };
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
