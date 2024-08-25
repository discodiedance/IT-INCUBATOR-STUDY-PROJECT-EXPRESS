export type OutputUserType = {
  id: string;
  login: string;
  email: string;

  createdAt: string;
};

export type UserDBType = {
  id: string;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
  passwordRecoveryConfirmation: PasswordRecoveryType;
};

export type UserAccountType = {
  email: string;
  login: string;
  createdAt: Date;
  passwordHash: string;
  passwordSalt: string;
};

export type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type PasswordRecoveryType = {
  recoveryCode: string;
  expirationDate: Date | null;
};
