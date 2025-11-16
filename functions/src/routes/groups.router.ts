import { Router } from 'express';

import { GroupsController } from '../controllers/groups.controller';
import { getStats } from '../controllers/stats.controller';
import { requireAuth } from '../middleware/requireAuth';

export const groupsRouter = Router();

groupsRouter.get('/', requireAuth, GroupsController.getAll);
groupsRouter.get('/:id', requireAuth, GroupsController.getById);
groupsRouter.post('/', requireAuth, GroupsController.create);
groupsRouter.patch('/:id', requireAuth, GroupsController.update);
groupsRouter.delete('/:id', requireAuth, GroupsController.delete);
groupsRouter.get('/:id/stats', requireAuth, getStats('group'));
