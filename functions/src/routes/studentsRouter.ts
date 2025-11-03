import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';

import { createStudent } from './students/createStudent';
import { deleteStudent } from './students/deleteStudent';
import { geetStudentById } from './students/getStudentById';
import { getStudents } from './students/getStudents';
import { updateStudent } from './students/updateStudent';

export const studentsRouter = Router();

studentsRouter.get('/', requireAuth, getStudents);
studentsRouter.get('/:id', requireAuth, geetStudentById);
studentsRouter.post('/', requireAuth, createStudent);
studentsRouter.patch('/:id', requireAuth, updateStudent);
studentsRouter.delete('/:id', requireAuth, deleteStudent);
