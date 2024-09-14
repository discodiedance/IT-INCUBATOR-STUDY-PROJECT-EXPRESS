import { EmailAdapter } from "../adapters/email-adapter";

export class EmailsManager {
  constructor(protected EmailAdapter: EmailAdapter) {}
  async sendEmailConfirmationMessage(email: string, code: string) {
    const message = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>`;

    const subject = `Registration confirmation`;

    await this.EmailAdapter.sendEmail(email, subject, message);
  }

  async resendConfirmationMessage(email: string, code: string) {
    const message = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>`;

    const subject = `Resending registration confirmation `;

    await this.EmailAdapter.sendEmail(email, subject, message);
  }

  async sendPasswordRecoveryMessage(email: string, code: string) {
    const message = `<h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
       <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
   </p>`;

    const subject = `Password recovery`;

    await this.EmailAdapter.sendEmail(email, subject, message);
  }
}
