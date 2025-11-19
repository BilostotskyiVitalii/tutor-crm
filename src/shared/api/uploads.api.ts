// src/shared/api/uploads.api.ts
import { endpointsURL } from '@/shared/constants/endpointsUrl';

import { axs } from './axiosInstance';

export const UploadsAPI = {
  initiateAvatar: (
    data: { entityId: string; contentType: string; ext?: string },
    token?: string,
  ) =>
    axs.post(endpointsURL.apiUploadInit, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),

  uploadToPresignedUrl: async (uploadUrl: string, file: File) => {
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
  },

  finalizeAvatar: (
    data: { objectPath: string; deleteOldObjectPath?: string },
    token?: string,
  ) =>
    axs.post(endpointsURL.apiUploadfinal, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
};
