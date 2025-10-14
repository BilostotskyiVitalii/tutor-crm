import { useCallback } from 'react';

import { App as AntApp } from 'antd';
import { getAuth } from 'firebase/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { storage } from '@/app/firebase';

export const useUploadAvatar = () => {
  const { notification } = AntApp.useApp();

  const uploadAvatar = useCallback(
    async (file: File, studentId: string, oldAvatarUrl?: string) => {
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
        } catch {
          notification.error({ message: 'Old avatar deletion failed' });
        }
      }

      const storageRef = ref(
        storage,
        `avatars/${user.uid}/${studentId}/${file.name}`,
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      return downloadUrl;
    },
    [notification],
  );

  return { uploadAvatar };
};
