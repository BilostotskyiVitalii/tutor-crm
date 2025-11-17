import { v4 as uuidv4 } from 'uuid';

import { storage as adminStorage } from '../firebase';

const BUCKET = adminStorage.bucket().name;
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

export const UploadsService = {
  validateContentType(contentType: string) {
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      throw new Error('Unsupported content type');
    }
  },

  async initiateAvatarUpload(entityId: string, contentType: string, ext?: string) {
    this.validateContentType(contentType);

    const safeExt = ext && /^[a-z0-9]+$/i.test(ext) ? ext.toLowerCase() : 'jpg';
    const objectPath = `avatars/${entityId}.${safeExt}`;
    const file = adminStorage.bucket().file(objectPath);

    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 1000 * 60 * 5, // 5 хв
      contentType,
    });

    return { uploadUrl, objectPath };
  },

  async finalizeAvatarUpload(objectPath: string, deleteOldObjectPath?: string) {
    const bucket = adminStorage.bucket();
    const file = bucket.file(objectPath);

    const [exists] = await file.exists();
    if (!exists) {
      throw new Error('Object not found');
    }

    const token = uuidv4();
    await file.setMetadata({
      metadata: { firebaseStorageDownloadTokens: token },
      cacheControl: 'public,max-age=31536000',
    });

    if (deleteOldObjectPath && deleteOldObjectPath !== objectPath) {
      await bucket.file(deleteOldObjectPath).delete({ ignoreNotFound: true });
    }

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
      BUCKET,
    )}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;

    return { downloadUrl };
  },
};
