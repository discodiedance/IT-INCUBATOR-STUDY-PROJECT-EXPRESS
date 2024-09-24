import { OutputUserType } from "../../../../types/user/output";
import { UserDocumentType } from "../../../../types/user/user-enitities";

export const userMapper = (user: UserDocumentType): OutputUserType => {
  return {
    id: user.id,
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  };
};
