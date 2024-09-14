export class InputUserType {
  constructor(
    public login: string,
    public password: string,
    public email: string
  ) {}
}

export class SortDataUserType {
  constructor(
    public sortBy?: string,
    public sortDirection?: "asc" | "desc",
    public pageNumber?: number,
    public pageSize?: number,
    public searchLoginTerm?: string,
    public searchEmailTerm?: string
  ) {}
}
