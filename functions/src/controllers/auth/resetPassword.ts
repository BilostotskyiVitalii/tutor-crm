import { Request, Response } from 'express';

import { admin } from '../../firebase';
import { axsAuth } from '../../utils/axsAuth';
import { sendEmail } from '../../utils/sendEmail';

const { FRONTEND_RESET_PASSWORD_URL } = process.env;

export const reset = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${FRONTEND_RESET_PASSWORD_URL}?email=${email}`,
      handleCodeInApp: true,
    });

    const query = resetLink.split('?')[1];
    const customLink = `${FRONTEND_RESET_PASSWORD_URL}?${query}`;

    await sendEmail({
      to: email,
      subject: 'Tutor CRM - Password Reset',
      html: `<p>Click <a href="${customLink}">here</a> to reset your password</p>`,
    });

    return res.status(200).json({ message: 'Password reset link sent', resetLink });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send reset link';
    return res.status(400).json({ message });
  }
};

export const resetConfirm = async (req: Request, res: Response) => {
  const { oobCode, newPassword } = req.body as { oobCode: string; newPassword: string };

  if (!oobCode || !newPassword) {
    return res.status(400).json({ message: 'Missing oobCode or new password' });
  }

  try {
    const { data } = await axsAuth.post('accounts:resetPassword', { oobCode, newPassword });

    return res.status(200).json({ success: true, email: data.email });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset password';
    return res.status(400).json({ message });
  }
};
