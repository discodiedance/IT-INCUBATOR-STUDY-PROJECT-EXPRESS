import { inject, injectable } from "inversify";
import { CommentRepository } from "../../infrastructure/repositories/comment-repository";
import { CommentDocumentType } from "../../../types/comment/comment-entities";
import { OutputUserType } from "../../../types/user/output";
import { UpdateCommentDataType } from "../../../types/comment/comment-dto";

@injectable()
export class CommentService {
  constructor(
    @inject(CommentRepository) protected CommentRepository: CommentRepository
  ) {}

  async updateComment(
    comment: CommentDocumentType,
    content: UpdateCommentDataType
  ): Promise<boolean> {
    comment.updateComment(content);
    const updatetComment = await this.CommentRepository.save(comment);
    if (!updatetComment) {
      return false;
    }
    return true;
  }

  async checkCredentials(
    comment: CommentDocumentType,
    user: OutputUserType
  ): Promise<boolean | null> {
    if (!comment.isCommentatorIdAndLoginEqual(user)) {
      return null;
    }
    return true;
  }
}
