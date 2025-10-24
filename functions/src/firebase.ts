import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

if (getApps().length === 0) {
  admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'tutor-crm-49cae',
    storageBucket: 'tutor-crm-49cae.appspot.com',
  });
}

export { admin };
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
