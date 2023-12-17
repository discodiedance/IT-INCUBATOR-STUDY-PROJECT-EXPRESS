import { userCollection } from "../../db/db";
import { userMapper } from "../../middlewares/user/user-mapper";
import { SortDataUserType } from "../../types/user/input";

export class QueryUserRepository {
  static async getAllUsers(sortData: SortDataUserType) {
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

    const users = await userCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(userMapper),
    };
  }
}
