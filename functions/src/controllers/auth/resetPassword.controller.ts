import { Request, Response } from 'express';

import { ResetPasswordService } from '../../services/auth/resetPassword.service';

export const reset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await ResetPasswordService.requestReset(email);

    return res.status(200).json({ message: 'Password reset link sent', ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send reset link';
    return res.status(400).json({ message });
  }
};

export const resetConfirm = async (req: Request, res: Response) => {
  try {
    const { oobCode, newPassword } = req.body;

    if (!oobCode || !newPassword) {
      return res.status(400).json({ message: 'Missing oobCode or new password' });
    }

    const result = await ResetPasswordService.confirmReset(oobCode, newPassword);

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to reset password';
    return res.status(400).json({ message });
  }
};
