import { PostDocumentType } from "../../post/post-entities";

export class CreatePostLikeData {
  constructor(
    public post: PostDocumentType,
    public likeStatus: "None" | "Like" | "Dislike",
    public parentId: string,
    public parentLogin: string
  ) {}
}

export class UpdatePostLikeData {
  constructor(
    public post: PostDocumentType,
    public likeStatus: "None" | "Like" | "Dislike",
    public parentId: string,
    public parentLogin: string
  ) {}
}

export class PostLikesDBType {
  constructor(
    public id: string,
    public createdAt: string,
    public status: "None" | "Like" | "Dislike",
    public parentId: string,
    public parentLogin: string,
    public postId: string,
    public isFirstReaction: boolean,
    public isDeleted: boolean
  ) {}
}
