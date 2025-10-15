import * as admin from 'firebase-admin';

admin.initializeApp(); // Без конфигурации — Firebase сам подставит нужные ключи

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
