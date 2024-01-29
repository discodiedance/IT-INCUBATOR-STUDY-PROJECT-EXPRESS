import nodemailer from "nodemailer";

export class emailAdapter {
  static async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: "Mail.ru",
      auth: {
        user: "exitg0d@mail.ru",
        pass: process.env.MAIL_RU_PASS,
      },
    });

    let sendingResult = await transport.sendMail({
      from: "Jerome <exitg0d@mail.ru>",
      to: email,
      subject: subject,
      html: message,
    });
    return sendingResult;
  }
}
