import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';

import { createLesson } from './lessons/createLesson';
import { deleteLesson } from './lessons/deleteLesson';
import { getLessonById } from './lessons/getLessonById';
import { getLessons } from './lessons/getLessons';
import { updateLesson } from './lessons/updateLesson';

export const lessonsRouter = Router();

lessonsRouter.get('/', requireAuth, getLessons);
lessonsRouter.get('/:id', requireAuth, getLessonById);
lessonsRouter.post('/', requireAuth, createLesson);
lessonsRouter.patch('/:id', requireAuth, updateLesson);
lessonsRouter.delete('/:id', requireAuth, deleteLesson);
