import { RESET_PASSWORD_URL } from '../../config';
import { admin } from '../../firebase';
import { axsAuth } from '../../utils/axsAuth';
import { sendEmail } from '../../utils/sendEmail';

export const ResetPasswordService = {
  async requestReset(email: string) {
    const frontendResetUrl = RESET_PASSWORD_URL.value();

    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${frontendResetUrl}?email=${email}`,
      handleCodeInApp: true,
    });

    const query = resetLink.split('?')[1];
    const customLink = `${frontendResetUrl}?${query}`;

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
