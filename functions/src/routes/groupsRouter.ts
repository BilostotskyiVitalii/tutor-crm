import { Router } from 'express';

import { deleteEntity } from '../controllers/deleteEntityController';
import { getEntities } from '../controllers/getEntitiesController';
import { getEntityById } from '../controllers/getEntityByIdController';
import { createGroup } from '../controllers/groups/createGroup';
import { updateGroup } from '../controllers/groups/updateGroup';
import { getStats } from '../controllers/statsController';
import { requireAuth } from '../middleware/requireAuth';

export const groupsRouter = Router();

groupsRouter.get('/', requireAuth, getEntities('groups'));
groupsRouter.get('/:id', requireAuth, getEntityById('groups'));
groupsRouter.post('/', requireAuth, createGroup);
groupsRouter.patch('/:id', requireAuth, updateGroup);
groupsRouter.delete('/:id', requireAuth, deleteEntity('groups'));
groupsRouter.get('/:id/stats', requireAuth, getStats('group'));
