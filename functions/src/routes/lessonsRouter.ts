import { Router } from 'express';

import { deleteEntity } from '../controllers/deleteEntityController';
import { getEntities } from '../controllers/getEntitiesController';
import { getEntityById } from '../controllers/getEntityByIdController';
import { createLesson } from '../controllers/lessons/createLesson';
import { updateLesson } from '../controllers/lessons/updateLesson';
import { requireAuth } from '../middleware/requireAuth';

export const lessonsRouter = Router();

lessonsRouter.get('/', requireAuth, getEntities('lessons'));
lessonsRouter.get('/:id', requireAuth, getEntityById('lessons'));
lessonsRouter.post('/', requireAuth, createLesson);
lessonsRouter.patch('/:id', requireAuth, updateLesson);
lessonsRouter.delete('/:id', requireAuth, deleteEntity('lessons'));
