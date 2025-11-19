import { useCallback } from 'react';

import { UploadsAPI } from '@/shared/api/uploads.api';

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

      const { data: initData } = await UploadsAPI.initiateAvatar(
        { entityId, contentType, ext },
        token || undefined,
      );

      const { uploadUrl, objectPath } = initData;

      await UploadsAPI.uploadToPresignedUrl(uploadUrl, file);

      const deleteOldObjectPath =
        oldAvatarUrlOrNull && oldAvatarUrlOrNull.includes('/o/')
          ? decodeURIComponent(oldAvatarUrlOrNull.split('/o/')[1].split('?')[0])
          : undefined;

      const { data: finalizeData } = await UploadsAPI.finalizeAvatar(
        { objectPath, deleteOldObjectPath },
        token || undefined,
      );

      return finalizeData.downloadUrl as string;
    },
    [],
  );

  return { uploadAvatar };
};
