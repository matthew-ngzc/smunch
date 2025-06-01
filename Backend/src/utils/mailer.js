
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationEmail = async (to, token) => {
//   const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

//   await resend.emails.send({
//     from: 'SMUNCH <onboarding@resend.dev>',
//     to,
//     subject: 'Verify your SMUNCH account',
//     html: `<p>Welcome to SMUNCH! Click <a href="${link}">here</a> to verify your account. This link expires in 1 hour.</p>`
//   });
// };


//Using Gmail account
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your SMTP provider
  auth: {
    user: process.env.SMUNCH_EMAIL,
    pass: process.env.SMUNCH_APP_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  const link = `${process.env.BACKEND_URL}/api/auth/verify?token=${token}`;
  return transporter.sendMail({
    from: '"SMUNCH" <smunch.dev@gmail.com>',
    to,
    subject: 'Verify your SMUNCH Account',
    html: `<p>Click <a href="${link}">here</a> to activate your account. Link expires in 1 hour.</p>`,
  });
};

