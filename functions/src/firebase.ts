import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

dotenv.config();

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
  });
}

export { admin };
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
