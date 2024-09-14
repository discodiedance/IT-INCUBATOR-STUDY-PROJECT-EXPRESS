import nodemailer from "nodemailer";
import { GMAIL_COM_PASS } from "../config";

export class EmailAdapter {
  async sendEmail(email: string, subject: string, message: string) {
    const transport = nodemailer.createTransport({
      service: "Gmail",
      secure: false,
      auth: {
        user: "fundu1448@gmail.com",
        pass: GMAIL_COM_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const sendingResult = await transport.sendMail({
      from: "Jerome V. <fundu1448@gmail.com>",
      to: email,
      subject: subject,
      html: message,
    });
    return sendingResult;
  }
}
