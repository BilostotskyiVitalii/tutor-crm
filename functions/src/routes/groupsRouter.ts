import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';

import { createGroup } from './groups/createGroup';
import { deleteGroup } from './groups/deleteGroup';
import { getGroupById } from './groups/getGroupById';
import { getGroups } from './groups/getGroups';
import { getGroupStats } from './groups/getGroupStats';
import { updateGroup } from './groups/updateGroup';

export const groupsRouter = Router();

groupsRouter.get('/', requireAuth, getGroups);
groupsRouter.get('/:id', requireAuth, getGroupById);
groupsRouter.post('/', requireAuth, createGroup);
groupsRouter.patch('/:id', requireAuth, updateGroup);
groupsRouter.delete('/:id', requireAuth, deleteGroup);
groupsRouter.get('/:id/stats', requireAuth, getGroupStats);
