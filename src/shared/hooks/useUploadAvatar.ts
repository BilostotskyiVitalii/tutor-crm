import { useCallback } from 'react';

import { endpointsURL } from '@/shared/constants/endpointsUrl';

const { apiBaseUrl } = endpointsURL;
const token = localStorage.getItem('token');

export const useUploadAvatar = () => {
  const uploadAvatar = useCallback(
    async (
      file: File,
      studentId: string,
      oldAvatarUrlOrNull?: string | null,
    ) => {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const contentType = file.type || 'image/jpeg';

      // 1) Ініціюємо завантаження
      const headers = { Authorization: `Bearer ${token}` };
      const initResp = await fetch(`${apiBaseUrl}/uploads/avatars/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ studentId, contentType, ext }),
      });
      if (!initResp.ok) {
        throw new Error('Failed to initiate avatar upload');
      }
      const { uploadUrl, objectPath } = await initResp.json();

      // 2) Завантажуємо файл напряму у GCS signed URL
      const putResp = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      });
      if (!putResp.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // 3) Фіналізація — отримуємо постійний downloadUrl
      const deleteOldObjectPath =
        oldAvatarUrlOrNull && oldAvatarUrlOrNull.includes('/o/')
          ? decodeURIComponent(oldAvatarUrlOrNull.split('/o/')[1].split('?')[0])
          : undefined;

      const finalizeResp = await fetch(
        `${apiBaseUrl}/uploads/avatars/finalize`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ objectPath, deleteOldObjectPath }),
        },
      );
      if (!finalizeResp.ok) {
        throw new Error('Failed to finalize avatar upload');
      }
      const { downloadUrl } = await finalizeResp.json();

      return downloadUrl as string;
    },
    [],
  );

  return { uploadAvatar };
};
