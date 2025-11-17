import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { storage as adminStorage } from '../firebase';

const uploadsRouter = Router();

const BUCKET = adminStorage.bucket().name;
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

interface InitiateUploadBody {
  entityId: string;
  contentType: string;
  ext?: string;
}

interface FinalizeUploadBody {
  objectPath: string;
  deleteOldObjectPath?: string;
}

// TODO split to constroller and service

// --- INITIATE ---
uploadsRouter.post(
  '/avatars/initiate',
  async (req: Request<unknown, unknown, InitiateUploadBody>, res: Response) => {
    try {
      const { entityId, contentType, ext } = req.body ?? {};
      if (!entityId || !contentType) {
        return res.status(400).json({ message: 'entityId and contentType are required' });
      }

      if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
        return res.status(415).json({ message: 'Unsupported content type' });
      }

      const safeExt =
        typeof ext === 'string' && /^[a-z0-9]+$/i.test(ext) ? ext.toLowerCase() : 'jpg';

      const objectPath = `avatars/${entityId}.${safeExt}`;
      const file = adminStorage.bucket().file(objectPath);

      // Signed URL v4 for upload (PUT)
      const expires = Date.now() + 1000 * 60 * 5;
      const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires,
        contentType,
      });

      return res.json({ uploadUrl, objectPath });
    } catch {
      return res.status(500).json({ message: 'Failed to initiate upload' });
    }
  },
);

// --- FINALIZE ---
uploadsRouter.post(
  '/avatars/finalize',
  async (req: Request<unknown, unknown, FinalizeUploadBody>, res: Response) => {
    try {
      const { objectPath, deleteOldObjectPath } = req.body ?? {};
      if (!objectPath) {
        return res.status(400).json({ message: 'objectPath is required' });
      }

      const bucket = adminStorage.bucket();
      const file = bucket.file(objectPath);

      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ message: 'Object not found' });
      }

      const token = uuidv4();
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
        cacheControl: 'public,max-age=31536000',
      });

      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
        BUCKET,
      )}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;

      if (deleteOldObjectPath && deleteOldObjectPath !== objectPath) {
        try {
          await bucket.file(deleteOldObjectPath).delete({ ignoreNotFound: true });
        } catch {
          return res.status(500).json({ message: 'Failed to delete old avatar' });
        }
      }

      return res.json({ downloadUrl });
    } catch {
      return res.status(500).json({ message: 'Failed to finalize upload' });
    }
  },
);

export { uploadsRouter };
