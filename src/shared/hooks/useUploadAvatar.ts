import { useCallback } from 'react';

import { axs } from '@/shared/api/axiosInstance';

export const useUploadAvatar = () => {
  const uploadAvatar = useCallback(
    async (
      file: File,
      entityId: string,
      oldAvatarUrlOrNull?: string | null,
    ) => {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const contentType = file.type || 'image/jpeg';

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const { data: initData } = await axs.post(
        '/uploads/avatars/initiate',
        { entityId, contentType, ext },
        { headers },
      );
      const { uploadUrl, objectPath } = initData;

      await axs.put(uploadUrl, file, {
        headers: { 'Content-Type': contentType },
        transformRequest: [(data) => data],
      });

      const deleteOldObjectPath =
        oldAvatarUrlOrNull && oldAvatarUrlOrNull.includes('/o/')
          ? decodeURIComponent(oldAvatarUrlOrNull.split('/o/')[1].split('?')[0])
          : undefined;

      const { data: finalizeData } = await axs.post(
        '/uploads/avatars/finalize',
        { objectPath, deleteOldObjectPath },
        { headers },
      );

      return finalizeData.downloadUrl as string;
    },
    [],
  );

  return { uploadAvatar };
};
