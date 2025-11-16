import { Router } from 'express';

import { DashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/requireAuth';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', requireAuth, DashboardController.getStat);
