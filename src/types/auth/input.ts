export type InputLoginOrEmailType = {
  loginOrEmail: string;
  password: string;
};

export type AuthType = {
  loginOrEmail: string;
  password: string;
  _id?: string;
};

export type AuthMeType = {
  userId: string;
  email: string;
  login: string;
};
