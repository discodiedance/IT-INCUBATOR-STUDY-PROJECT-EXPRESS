export type OutputUserBody = {
  id: string;
  login: string;
  password: string;
  email: string;
  createdAt: string;
};

export type OutputUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserType = {
  id?: string;
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
};
