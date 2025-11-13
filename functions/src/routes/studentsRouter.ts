import { Router } from 'express';

import { deleteEntity } from '../controllers/deleteEntityController';
import { getEntities } from '../controllers/getEntitiesController';
import { getEntityById } from '../controllers/getEntityByIdController';
import { getStats } from '../controllers/statsController';
import { createStudent } from '../controllers/students/createStudent';
import { updateStudent } from '../controllers/students/updateStudent';
import { requireAuth } from '../middleware/requireAuth';

export const studentsRouter = Router();

studentsRouter.get('/', requireAuth, getEntities('students'));
studentsRouter.get('/:id', requireAuth, getEntityById('students'));
studentsRouter.post('/', requireAuth, createStudent);
studentsRouter.patch('/:id', requireAuth, updateStudent);
studentsRouter.delete('/:id', requireAuth, deleteEntity('students'));
studentsRouter.get('/:id/stats', requireAuth, getStats('student'));
