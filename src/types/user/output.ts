export type OutputUserType = {
  userId: string;
  email: string;
  login: string;
  createdAt: string;
};

export type UserDBType = {
  id: string;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
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
