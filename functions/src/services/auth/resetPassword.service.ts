import { admin } from '../../firebase';
import { axsAuth } from '../../utils/axsAuth';
import { sendEmail } from '../../utils/sendEmail';

const { FRONTEND_RESET_PASSWORD_URL } = process.env;

export const ResetPasswordService = {
  async requestReset(email: string) {
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

    return { resetLink };
  },

  async confirmReset(oobCode: string, newPassword: string) {
    const { data } = await axsAuth.post('accounts:resetPassword', {
      oobCode,
      newPassword,
    });

    return { email: data.email };
  },
};
