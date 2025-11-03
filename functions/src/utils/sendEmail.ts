import nodemailer from 'nodemailer';

const { EMAIL_USER, EMAIL_PASS } = process.env;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  await transporter.sendMail({
    from: `"Tutor CRM" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
