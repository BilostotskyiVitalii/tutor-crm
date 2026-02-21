import nodemailer from 'nodemailer';

import { EMAIL_PASS, EMAIL_USER } from '../config';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER.value(),
    pass: EMAIL_PASS.value(),
  },
});

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  await transporter.sendMail({
    from: `"Tutor CRM" <${EMAIL_USER.value()}>`,
    to,
    subject,
    html,
  });
}
