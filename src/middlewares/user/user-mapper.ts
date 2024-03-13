import { OutputUserType, UserDBType } from "../../types/user/output";

export const userMapper = (user: UserDBType): OutputUserType => {
  return {
    id: user._id!.toString(),
    login: user.accountData.login,
    email: user.accountData.email,
    passwordSalt: user.accountData.passwordSalt,
    createdAt: user.accountData.createdAt.toString(),
  };
};
