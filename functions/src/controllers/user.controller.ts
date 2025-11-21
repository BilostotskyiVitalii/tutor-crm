import { Request, Response } from 'express';

import { UserService } from '../services/user.service';

type AuthenticatedRequest = Request & { user?: { uid: string } };

export const UserController = {
  update: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { email, nickName, avatar } = req.body;

      const { user, jwt } = await UserService.update(uid, { email, nickName, avatar });

      if (jwt) {
        res.cookie('token', jwt, { httpOnly: true, secure: true });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  },
};
