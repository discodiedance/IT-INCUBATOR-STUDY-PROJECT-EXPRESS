export class UpdatePostDataType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string
  ) {}
}

export class CreatePostDataType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string
  ) {}
}

export class PostSortDataType {
  constructor(
    public pageNumber?: number,
    public pageSize?: number,
    public sortBy?: string,
    public sortDirection?: "asc" | "desc",
    public blogId?: string
  ) {}
}

export class PostDBType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
    },
    public newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[]
  ) {}
}
