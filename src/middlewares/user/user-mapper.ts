import { OutputUserType, UserDBType } from "../../types/user/output";

export const userMapper = (user: UserDBType): OutputUserType => {
  return {
    id: user.id,
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt.toISOString(),
  };
};
