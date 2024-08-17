import { UserModel } from "../db/db";
import { UserDBType } from "../types/user/output";

export class UserRepostitory {
  static async createUser(inputCreateUser: UserDBType): Promise<UserDBType> {
    const createdUser: UserDBType | null =
      await UserModel.create(inputCreateUser);
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
}
