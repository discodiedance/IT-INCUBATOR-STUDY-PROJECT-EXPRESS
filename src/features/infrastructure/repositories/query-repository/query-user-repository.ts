import { injectable } from "inversify";

import { OutputUserType } from "../../../../types/user/output";
import { UserModel } from "../../../domain/entities/user-entity";
import { UserDocumentType } from "../../../../types/user/user-enitities";
import { UserSortDataUserType } from "../../../../types/user/user-dto";
import { userMapper } from "../../../application/mappers/user/user-mapper";

@injectable()
export class QueryUserRepository {
  async getAllUsers(sortData: UserSortDataUserType) {
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "desc";
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const searchEmailTerm = sortData.searchEmailTerm ?? null;

    let filterLogin = {};
    let filterEmail = {};

    if (searchLoginTerm) {
      filterLogin = {
        login: {
          $regex: searchLoginTerm,
          $options: "i",
        },
      };
    }

    if (searchEmailTerm) {
      filterEmail = {
        email: {
          $regex: searchEmailTerm,
          $options: "i",
        },
      };
    }

    const filter = {
      $or: [filterLogin, filterEmail],
    };

    const users = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize);

    const totalCount = await UserModel.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(userMapper),
    };
  }

  async getUserByUserId(userId: string): Promise<OutputUserType | null> {
    const user: UserDocumentType | null = await UserModel.findOne({
      id: userId,
    });
    if (!user) {
      return null;
    }
    return userMapper(user);
  }

  async getMappedUserByLogin(login: string): Promise<OutputUserType | null> {
    const user = await UserModel.findOne({
      "accountData.login": login,
    });
    if (!user) {
      return null;
    }
    return userMapper(user);
  }

  async getMappedUserByEmail(email: string): Promise<OutputUserType | null> {
    const user = await UserModel.findOne({
      "accountData.email": email,
    });
    if (!user) {
      return null;
    }
    return userMapper(user);
  }
}
