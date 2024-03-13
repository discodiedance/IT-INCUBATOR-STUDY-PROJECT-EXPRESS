import { ObjectId } from "mongodb";
import { userCollection } from "../db/db";
import { UserDBType } from "../types/user/output";

export class UserRepostitory {
  static async createUser(inputCreateUser: UserDBType) {
    const createdUser = await userCollection.insertOne({ ...inputCreateUser });
    inputCreateUser._id = createdUser.insertedId;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

    return !!result.deletedCount;
  }

  static async updateConfirmation(_id: ObjectId) {
    const result = await userCollection.updateOne(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );

    return result.matchedCount === 1;
  }

  static async findyByLogin(login: string) {
    const user = await userCollection.findOne({
      "accountData.login": login,
    });
    return user;
  }

  static async findyByEmail(email: string) {
    const user = await userCollection.findOne({
      "accountData.email": email,
    });
    return user;
  }

  static async findByLoginOrEmail(loginOrEmail: string) {
    const user = await userCollection.findOne({
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

  static async findUserByConfirmationCode(emailConfirmationCode: string) {
    const user = await userCollection.findOne({
      "emailConfirmation.confirmationCode": emailConfirmationCode,
    });

    return user;
  }

  static async updateConfirmationCode(
    code: string,
    email: string
  ): Promise<boolean> {
    const result = await userCollection.updateOne(
      {
        "accountData.email": email,
      },
      { $set: { "emailConfirmation.confirmationCode": code } }
    );
    return result.modifiedCount === 1;
  }
}
