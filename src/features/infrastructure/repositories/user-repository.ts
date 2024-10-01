import { injectable } from "inversify";
import { UserModel } from "../../domain/entities/user-entity";
import { UserDocumentType } from "../../../types/user/user-enitities";

@injectable()
export class UserRepository {
  async save(model: UserDocumentType) {
    return await model.save();
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id: id });
    return !!result.deletedCount;
  }

  async getUserByEmail(email: string): Promise<UserDocumentType | null> {
    const user = await UserModel.findOne({
      "accountData.email": email,
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<UserDocumentType | null> {
    const user = await UserModel.findOne({
      $or: [
        {
          "accountData.email": {
            $regex: loginOrEmail,
            $options: "i",
          },
        },
        {
          "accountData.login": {
            $regex: loginOrEmail,
            $options: "i",
          },
        },
      ],
    });
    return user;
  }

  async getUserByConfirmationCode(
    emailConfirmationCode: string
  ): Promise<UserDocumentType | null> {
    const user = await UserModel.findOne({
      "emailConfirmation.confirmationCode": emailConfirmationCode,
    });
    return user;
  }

  async getUserByRecoveryConfirmationCode(
    recoveryCode: string
  ): Promise<UserDocumentType | null> {
    const user = await UserModel.findOne({
      "passwordRecoveryConfirmation.recoveryCode": recoveryCode,
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
