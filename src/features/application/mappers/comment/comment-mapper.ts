import { commentLikesRepository } from "../../../../routes/composition-root";
import { CommentLikesDocumentType } from "../../../../types/comment-likes/comment-likes-entities";
import { CommentDocumentType } from "../../../../types/comment/comment-entities";
import {
  OutputCommentTypeWithStatus,
  OutputCommentType,
} from "../../../../types/comment/output";

export const commentMapperWithStatus = async (
  comment: CommentDocumentType,
  parentId: string
): Promise<OutputCommentTypeWithStatus> => {
  const likeData: CommentLikesDocumentType | null =
    await commentLikesRepository.getLikeDataByParentIdAndCommentId(
      parentId,
      comment.id
    );
  if (!likeData) {
    const dataForLiksInfo = { myStatus: "None", ...comment.likesInfo };
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: dataForLiksInfo,
    };
  } else {
    const dataForLiksInfo = { myStatus: likeData.status, ...comment.likesInfo };
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: dataForLiksInfo,
    };
  }
};

export const commentMapper = async (
  comment: CommentDocumentType
): Promise<OutputCommentType> => {
  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: comment.likesInfo,
  };
};
