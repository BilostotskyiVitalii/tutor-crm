// src/routes/uploads.router.ts
import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { storage as adminStorage } from '../firebase'; // ваш barrel

const uploadsRouter = Router();

const BUCKET = adminStorage.bucket().name; // або явно: 'tutor-crm-49cae.appspot.com'
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

// Тип для ініціації завантаження
interface InitiateUploadBody {
  studentId: string;
  contentType: string;
  ext?: string;
}

// Тип для фіналізації завантаження
interface FinalizeUploadBody {
  objectPath: string;
  deleteOldObjectPath?: string;
}

// --- INITIATE ---
uploadsRouter.post(
  '/avatars/initiate',
  async (req: Request<unknown, unknown, InitiateUploadBody>, res: Response) => {
    try {
      const { studentId, contentType, ext } = req.body ?? {};
      if (!studentId || !contentType) {
        return res.status(400).json({ message: 'studentId and contentType are required' });
      }

      if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
        return res.status(415).json({ message: 'Unsupported content type' });
      }

      const safeExt =
        typeof ext === 'string' && /^[a-z0-9]+$/i.test(ext) ? ext.toLowerCase() : 'jpg';

      const objectPath = `avatars/${studentId}.${safeExt}`;
      const file = adminStorage.bucket().file(objectPath);

      // Signed URL v4 for upload (PUT)
      const expires = Date.now() + 1000 * 60 * 5; // 5 хвилин
      const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires,
        contentType, // мусить збігатися з тим, що FE поставить у PUT
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

      // Переконаємось, що файл існує
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ message: 'Object not found' });
      }

      // Додаємо download token для public downloadUrl у Firebase Storage API v0
      const token = uuidv4();
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
        cacheControl: 'public,max-age=31536000',
      });

      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
        BUCKET,
      )}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;

      // Опційно видалимо старий файл
      if (deleteOldObjectPath && deleteOldObjectPath !== objectPath) {
        try {
          await bucket.file(deleteOldObjectPath).delete({ ignoreNotFound: true });
        } catch (e) {
          console.warn('Failed to delete old avatar:', e instanceof Error ? e.message : e);
        }
      }

      return res.json({ downloadUrl });
    } catch (err) {
      console.error('finalize upload error:', err instanceof Error ? err.message : err);
      return res.status(500).json({ message: 'Failed to finalize upload' });
    }
  },
);

export { uploadsRouter };
