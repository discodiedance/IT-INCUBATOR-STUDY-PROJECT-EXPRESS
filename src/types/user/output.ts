import { ObjectId, WithId } from "mongodb";

export type OutputUserBody = {
  id: string;
  login: string;
  password: string;
  email: string;
  createdAt: string;
};

export type OutputUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  // passwordSalt: string;
};

export type UserType = {
  _id?: ObjectId;
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
};

export type UserDBType = WithId<{
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
}>;

export type UserAccountType = {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};

export type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
  // sentEmails: [];
};

export type RegstrationDataType = {
  ip: string;
};

// export type SentEmailType = {
//   sentDate: Date;
// };
