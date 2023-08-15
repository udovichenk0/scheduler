import { transporter } from '.';

export const sendEmail = async (email: string, token: string) => {
  const info = await transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify your email',
      html: `<h1>${token}</h1>`,
    },
    (err, info) => {
      if (err) {
        console.log(err);
      }
      return info;
    },
  );
  return info;
};
