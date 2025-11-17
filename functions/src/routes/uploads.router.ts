import { Router } from 'express';

import { UploadsController } from '../controllers/uploads.controller';

const uploadsRouter = Router();

uploadsRouter.post('/avatars/initiate', UploadsController.initiateAvatar);
uploadsRouter.post('/avatars/finalize', UploadsController.finalizeAvatar);

export { uploadsRouter };
