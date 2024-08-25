import { add } from "date-fns/add";
import { UserModel } from "../db/db";
import { UserDBType } from "../types/user/output";

export class UserRepostitory {
  static async createUser(inputCreateUser: UserDBType): Promise<UserDBType> {
    const createdUser: UserDBType = await UserModel.create(inputCreateUser);
    return createdUser;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }

  static async updateConfirmation(id: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { id: id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );

    return result.matchedCount === 1;
  }

  static async updateConfirmationCode(
    code: string,
    email: string
  ): Promise<boolean> {
    const result = await UserModel.updateOne(
      {
        "accountData.email": email,
      },
      { $set: { "emailConfirmation.confirmationCode": code } }
    );
    return result.modifiedCount === 1;
  }

  static async updateNewPasswordByUserId(
    passwordHash: string,
    userId: string
  ): Promise<boolean> {
    const result = await UserModel.updateOne(
      {
        id: userId,
      },
      { $set: { "accountData.passwordHash": passwordHash } }
    );
    return result.modifiedCount === 1;
  }

  static async addRecoveryPasswordCodeToUserById(code: string, userId: string) {
    const result = await UserModel.updateOne(
      {
        id: userId,
      },
      {
        $set: {
          "passwordRecoveryConfirmation.recoveryCode": code,
          "passwordRecoveryConfirmation.expirationDate": add(new Date(), {
            hours: 1,
            minutes: 5,
          }),
        },
      }
    );
    return result.modifiedCount === 1;
  }
}
