import { UserModel } from "../../db/db";
import { userMapper } from "../../middlewares/user/user-mapper";
import { SortDataUserType } from "../../types/user/input";
import { OutputUserType, UserDBType } from "../../types/user/output";

export class QueryUserRepository {
  async getAllUsers(sortData: SortDataUserType) {
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

  async getUserById(userId: string): Promise<OutputUserType | null> {
    const user: UserDBType | null = await UserModel.findOne({ id: userId });
    if (!user) {
      return null;
    }
    return userMapper(user);
  }

  async findyByLogin(login: string) {
    const user: UserDBType | null = await UserModel.findOne({
      "accountData.login": login,
    });
    return user;
  }

  async findyByEmail(email: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await UserModel.findOne({
      "accountData.email": email,
    });
    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user: UserDBType | null = await UserModel.findOne({
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

  async findUserByConfirmationCode(
    emailConfirmationCode: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await UserModel.findOne({
      "emailConfirmation.confirmationCode": emailConfirmationCode,
    });
    return user;
  }

  async findUserByRecoveryConfirmationCode(
    passwordRecoveryCode: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await UserModel.findOne({
      "passwordRecoveryConfirmation.recoveryCode": passwordRecoveryCode,
    });
    return user;
  }

  async findPasswordSaltByUserId(userId: string): Promise<string | null> {
    const user: UserDBType | null = await UserModel.findOne({
      id: userId,
    });
    return user!.accountData.passwordSalt;
  }

  //--------------------------for e2e tests--------------------------

  async findConfirmationCodeByEmail(email: string) {
    const user = await UserModel.findOne({
      "accountData.email": email,
    });
    return user!.emailConfirmation.confirmationCode;
  }

  async findPasswordRecoveryConfirmationCodeByEmail(email: string) {
    const user = await UserModel.findOne({
      "accountData.email": email,
    });
    return user!.passwordRecoveryConfirmation.recoveryCode;
  }
}
