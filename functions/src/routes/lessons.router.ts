import { Router } from 'express';

import { LessonsController } from '../controllers/lessons.controller';
import { getStats } from '../controllers/stats.controller';
import { requireAuth } from '../middleware/requireAuth';

export const lessonsRouter = Router();

lessonsRouter.get('/', requireAuth, LessonsController.getAll);
lessonsRouter.get('/:id', requireAuth, LessonsController.getById);
lessonsRouter.post('/', requireAuth, LessonsController.create);
lessonsRouter.patch('/:id', requireAuth, LessonsController.update);
lessonsRouter.delete('/:id', requireAuth, LessonsController.delete);
lessonsRouter.get('/:id/stats', requireAuth, requireAuth, getStats('group'));
