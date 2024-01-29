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
    let result = await userCollection.updateOne(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.modifiedCount === 1;
  }

  static async findByLoginOrEmail(loginOrEmail: string) {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    return user;
  }
  static async findUserByConfirmationCode(emailConfirmationCode: string) {
    const user = await userCollection.findOne({
      "emailConfirmation.confirmationCode": emailConfirmationCode,
    });

    return user;
  }
}
