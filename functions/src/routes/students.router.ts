import { Router } from 'express';

import { getStats } from '../controllers/stats.controller';
import { StudentsController } from '../controllers/students.controller';
import { requireAuth } from '../middleware/requireAuth';

export const studentsRouter = Router();

studentsRouter.get('/', requireAuth, StudentsController.getAll);
studentsRouter.get('/:id', requireAuth, StudentsController.getById);
studentsRouter.post('/', requireAuth, StudentsController.create);
studentsRouter.patch('/:id', requireAuth, StudentsController.update);
studentsRouter.delete('/:id', requireAuth, StudentsController.delete);
studentsRouter.get('/:id/stats', requireAuth, getStats('student'));
