import { queryCommentLikeRepository } from "../../routes/composition-root";
import {
  CommentDBType,
  OutputCommentType,
  OutputCommentTypeWithStatus,
} from "../../types/comment/output";
import { CommentLikesDBType } from "../../types/like/output";

export const commentMapperWithStatus = async (
  comment: CommentDBType,
  parentId: string
): Promise<OutputCommentTypeWithStatus> => {
  const likeData: CommentLikesDBType | null =
    await queryCommentLikeRepository.findLikeDataByParentIdAndCommentId(
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
  comment: CommentDBType
): Promise<OutputCommentType> => {
  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: comment.likesInfo,
  };
};
