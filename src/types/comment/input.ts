export type CommentBody = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type UpdateCommentData = {
  content: string;
};

export type InputCommentType = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type CommentSortDataType = {
  postId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};
