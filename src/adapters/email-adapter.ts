import nodemailer from "nodemailer";
import { MAIL_RU_PASS } from "../config";

export class emailAdapter {
  static async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: "Mail.ru",
      secure: false,
      auth: {
        user: "exitg0d@mail.ru",
        pass: MAIL_RU_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
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
