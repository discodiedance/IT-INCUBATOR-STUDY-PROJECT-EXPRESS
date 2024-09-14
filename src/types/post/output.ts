export class PostDBType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string
  ) {}
}

export class OutputPostType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string
  ) {}
}

export class CreatePostToBlogType {
  constructor(
    public content: string,
    public shortDescription: string,
    public title: string
  ) {}
}

export class PostLikesDBType {
  constructor(
    public id: string,
    public createdAt: Date,
    public status: "None" | "Like" | "Dislike",
    public authorId: string,
    public parentIpublicd: string
  ) {}
}
