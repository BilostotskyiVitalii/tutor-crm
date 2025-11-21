import { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/requireAuth';

export const userRouter = Router();

userRouter.patch('/', requireAuth, UserController.update);
