export type InputCommentBody = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type InputCreateCommentData = {
  postId: string;
  content: string;
  userId: string;
  login: string;
};
export type InputCommentBodyWithPostId = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  postId: string;
};

export type UpdateCommentData = {
  content: string;
};

export type CommentSortDataType = {
  postId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};
