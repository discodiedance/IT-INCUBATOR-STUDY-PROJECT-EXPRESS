export class CommentLikesDBType {
  constructor(
    public id: string,
    public createdAt: Date,
    public status: "None" | "Like" | "Dislike",
    public parentId: string,
    public commentId: string
  ) {}
}
