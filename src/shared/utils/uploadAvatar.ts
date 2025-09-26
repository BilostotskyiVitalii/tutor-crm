import { getAuth } from 'firebase/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { storage } from '@/firebase';

// TODO make it reusable, not only for students avatars
export const uploadAvatar = async (
  file: File,
  studentId: string,
  oldAvatarUrl?: string,
) => {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (oldAvatarUrl) {
    try {
      const url = new URL(oldAvatarUrl);
      const pathname = decodeURIComponent(
        url.pathname.split('/o/')[1].split('?')[0],
      );

      const oldRef = ref(storage, pathname);
      await deleteObject(oldRef);
    } catch (err) {
      console.warn('Old avatar deletion failed:', err);
    }
  }

  const storageRef = ref(
    storage,
    `avatars/${user.uid}/${studentId}/${file.name}`,
  );
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
