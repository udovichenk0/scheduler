import { transporter } from '.';

export const sendEmail = async (email: string, token: string) => {
  const info = await transporter.sendMail(
    {
      from: 'denzel2.denis@gmail.com',
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
//!Another user trying to signup with the sasme email that hasn't been verified by first user

//!If first user didn't verify an account, and come back later and try to signup/signin again with the same email
//TODO if he signin we should check if the email is verified and if not send an code to email
