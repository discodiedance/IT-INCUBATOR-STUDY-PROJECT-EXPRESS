import { ObjectId } from "mongodb";
import { InputUserBody } from "../types/user/input";
import { userCollection } from "../db/db";
import { UserService } from "../domain/user-service";

export class UserRepostitory {
  static async createUser(newUser: InputUserBody) {
    const user = await UserService.createUser(newUser);

    return user;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const result = await userCollection.deleteOne({ _id: new ObjectId() });

    return !!result.deletedCount;
  }
}
