import nodeMailer from 'nodemailer';

export function sendMail(dest: string, subject: string, html: string): Promise<void> {
  return new Promise<void>(async (resolved, reject) => {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'Gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: `Jesús <${process.env.NODEMAILER_MAIL}>`,
      to: dest,
      subject,
      generateTextFromHTML: true,
      html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('error :C');
        reject(error);
      } else {
        console.log('enviado !');
        resolved();
      }
    });
  });
}
