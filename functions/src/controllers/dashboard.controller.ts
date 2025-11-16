import { Request, Response } from 'express';
import { Timestamp } from 'firebase-admin/firestore';

import { DashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../types/authTypes';

export const DashboardController = {
  getStat: async (req: Request, res: Response) => {
    try {
      const { uid } = (req as AuthenticatedRequest).user;
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ message: 'start and end query params required' });
      }

      const startTs = Timestamp.fromDate(new Date(start as string));
      const endExclusiveTs = Timestamp.fromDate(new Date(end as string));

      const stats = await DashboardService.getDashboard(uid, startTs, endExclusiveTs);
      return res.json(stats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      return res.status(500).json({ message });
    }
  },
};
