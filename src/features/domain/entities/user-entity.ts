import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { add } from "date-fns/add";
import { v4 as uuidv4 } from "uuid";
import {
  UserDBMethodsType,
  UserDocumentType,
  UserModelFullType,
} from "../../../types/user/user-enitities";
import { CreateUserDataType, UserDBType } from "../../../types/user/user-dto";

export const UserSchema = new mongoose.Schema<
  UserDBType,
  UserModelFullType,
  UserDBMethodsType
>({
  id: { type: String, require: true },
  accountData: {
    email: { type: String, require: true },
    login: { type: String, require: true },
    passwordHash: { type: String, require: true },
    createdAt: { type: String, require: true },
  },
  emailConfirmation: {
    confirmationCode: { type: String, require: true },
    expirationDate: { type: String, require: true },
    isConfirmed: { type: Boolean, require: true },
  },
  passwordRecoveryConfirmation: {
    recoveryCode: { type: String, require: true },
    expirationDate: { type: String, require: true },
  },
});

UserSchema.static(
  "createUser",
  function createUser(newUser: CreateUserDataType) {
    const user = new this();

    user.id = new ObjectId().toString();
    user.accountData = {
      email: newUser.email,
      login: newUser.login,
      passwordHash: newUser.passwordHash,
      createdAt: new Date().toISOString(),
    };
    user.emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 5,
      }),
      isConfirmed: false,
    };
    user.passwordRecoveryConfirmation = {
      recoveryCode: "",
      expirationDate: null,
    };

    return user;
  }
);

UserSchema.method(
  "addRecoveryPasswordCodeToUser",
  function addRecoveryPasswordCodeToUser(newCode: string) {
    (this.passwordRecoveryConfirmation.recoveryCode = newCode),
      (this.passwordRecoveryConfirmation.expirationDate = add(new Date(), {
        hours: 1,
        minutes: 5,
      }));
  }
);

UserSchema.method(
  "updateNewPassword",
  function updateNewPassword(newPasswordHash: string) {
    this.accountData.passwordHash = newPasswordHash;
  }
);

UserSchema.method(
  "updateEmailConfirmationCode",
  function updateEmailConfirmationCode(code: string) {
    this.emailConfirmation.confirmationCode = code;
  }
);

UserSchema.method(
  "updateEmailConfirmation",
  function updateEmailConfirmation(user: UserDocumentType) {
    user.emailConfirmation.isConfirmed = true;
  }
);

UserSchema.method(
  "isUserConfirmationCodeConfirmed",
  function isUserConfirmationCodeConfirmed() {
    return this.emailConfirmation.isConfirmed === true;
  }
);

UserSchema.method(
  "isUserConfirmationCodeEqual",
  function isUserConfirmationCodeEqual(code: string) {
    return this.emailConfirmation.confirmationCode === code;
  }
);

UserSchema.method(
  "isUserConfirmationCodeExpired",
  function isUserConfirmationCodeExpired() {
    return this.emailConfirmation.expirationDate < new Date();
  }
);

export const UserModel = mongoose.model<UserDBType, UserModelFullType>(
  "users",
  UserSchema
);
