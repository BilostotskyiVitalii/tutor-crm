import { Request, Response } from 'express';

import { LessonService } from '../services/lesson.service';
import { AuthenticatedRequest } from '../types/authTypes';

export const LessonsController = {
  create: async (req: Request, res: Response) => {
    try {
      const data = await LessonService.create(req.body, req as AuthenticatedRequest);
      return res.status(201).json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const code =
        err instanceof Error && err.name === 'ZodError' ? 400 : message === 'Not found' ? 404 : 401;
      return res.status(code).json({ message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = await LessonService.update(req.params.id, req.body, req as AuthenticatedRequest);
      return res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const code =
        err instanceof Error && err.name === 'ZodError' ? 400 : message === 'Not found' ? 404 : 401;
      return res.status(code).json({ message });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const data = await LessonService.getAll(req as AuthenticatedRequest);
      return res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return res.status(401).json({ message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const data = await LessonService.getById(req.params.id, req as AuthenticatedRequest);
      return res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const code = message === 'Not found' ? 404 : 401;
      return res.status(code).json({ message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await LessonService.delete(req.params.id, req as AuthenticatedRequest);
      return res.status(204).send();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return res.status(401).json({ message });
    }
  },
};
