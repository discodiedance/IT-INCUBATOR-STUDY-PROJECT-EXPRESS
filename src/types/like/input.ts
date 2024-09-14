import { OutputCommentType } from "../comment/output";

export class InputUpdateCommentLikeData {
  constructor(
    public comment: OutputCommentType,
    public likeStatus: string,
    public parentId: string
  ) {}
}

export class InputCreateLikeData {
  constructor(
    public id: string,
    public commentId: string,
    public createdAt: Date,
    public status: string,
    public parentId: string
  ) {}
}
