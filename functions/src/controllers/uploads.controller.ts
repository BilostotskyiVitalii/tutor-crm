import { Request, Response } from 'express';

import { UploadsService } from '../services/uploads.service';

export const UploadsController = {
  async initiateAvatar(req: Request, res: Response) {
    try {
      const { entityId, contentType, ext } = req.body ?? {};
      if (!entityId || !contentType) {
        return res.status(400).json({ message: 'entityId and contentType are required' });
      }

      const result = await UploadsService.initiateAvatarUpload(entityId, contentType, ext);
      return res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Unsupported content type') {
        return res.status(415).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Failed to initiate upload' });
    }
  },

  async finalizeAvatar(req: Request, res: Response) {
    try {
      const { objectPath, deleteOldObjectPath } = req.body ?? {};
      if (!objectPath) {
        return res.status(400).json({ message: 'objectPath is required' });
      }

      const result = await UploadsService.finalizeAvatarUpload(objectPath, deleteOldObjectPath);
      return res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Object not found') {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Failed to finalize upload' });
    }
  },
};
