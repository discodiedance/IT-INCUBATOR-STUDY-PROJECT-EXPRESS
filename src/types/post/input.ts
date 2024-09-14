export class UpdatePostData {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string
  ) {}
}

export class InputPostType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string
  ) {}
}

export class PostSortDataType {
  constructor(
    public pageNumber?: number,
    public pageSize?: number,
    public sortBy?: string,
    public sortDirection?: "asc" | "desc",
    public postId?: string
  ) {}
}
