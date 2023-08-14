import { transporter } from '.';

export const sendEmail = async (email: string, token: string) => {
  console.log(email, token)
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
