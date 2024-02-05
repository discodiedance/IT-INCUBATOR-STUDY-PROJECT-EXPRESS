import nodemailer from "nodemailer";
import { GMAIL_COM_PASS } from "../config";

export class emailAdapter {
  static async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: "Gmail",
      secure: false,
      auth: {
        user: "fundu1448@gmail.com",
        pass: GMAIL_COM_PASS,
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
