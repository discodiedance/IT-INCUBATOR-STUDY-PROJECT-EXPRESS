import { HydratedDocument, Model } from "mongoose";
import { CreateUserDataType, UserDBType } from "./user-dto";

export type UserDBMethodsType = {
  updateEmailConfirmation: (user: UserDocumentType) => void;
  updateEmailConfirmationCode: (code: string) => void;
  addRecoveryPasswordCodeToUser: (newCode: string) => void;
  updateNewPassword: (newPasswordHash: string) => void;
  isUserConfirmationCodeConfirmed: () => boolean;
  isUserConfirmationCodeEqual: (code: string) => boolean;
  isUserConfirmationCodeExpired: () => boolean;
};

type UserModelWithMethodsType = Model<UserDBType, {}, UserDBMethodsType>;

type UserModelStaticType = Model<UserDBType> & {
  createUser(newUser: CreateUserDataType): UserDocumentType;
};

export type UserModelFullType = UserModelWithMethodsType & UserModelStaticType;

export type UserDocumentType = HydratedDocument<UserDBType, UserDBMethodsType>;
