import { Request, Response } from 'express';

import { StudentService } from '../services/student.service';
import { AuthenticatedRequest } from '../types/authTypes';

export const StudentsController = {
  create: async (req: Request, res: Response) => {
    try {
      const data = await StudentService.create(req.body, req as AuthenticatedRequest);
      res.status(201).json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(message === 'Not found' ? 404 : 400).json({ message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = await StudentService.update(
        req.params.id,
        req.body,
        req as AuthenticatedRequest,
      );
      res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(message === 'Not found' ? 404 : 400).json({ message });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const data = await StudentService.getAll(req as AuthenticatedRequest);
      res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(401).json({ message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const data = await StudentService.getById(req.params.id, req as AuthenticatedRequest);
      res.json(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(message === 'Not found' ? 404 : 401).json({ message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await StudentService.delete(req.params.id, req as AuthenticatedRequest);
      res.status(204).send();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(401).json({ message });
    }
  },
};
