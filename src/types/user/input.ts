export type InputUserBody = {
  login: string;
  password: string;
  email: string;
};

export type InputUserType = {
  login: string;
  password: string;
  email: string;
};

export type SortDataUserType = {
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
