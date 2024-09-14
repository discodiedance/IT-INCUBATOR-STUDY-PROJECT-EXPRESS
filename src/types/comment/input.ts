export class InputCommentBody {
  constructor(
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    }
  ) {}
}

export class InputCreateCommentData {
  constructor(
    public postId: string,
    public content: string,
    public userId: string,
    public login: string
  ) {}
}

export class InputCommentBodyWithPostId {
  constructor(
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public postId: string
  ) {}
}

export class UpdateCommentData {
  constructor(public content: string) {}
}

export class InputLikeBody {
  constructor(public likeStatus: "None" | "Like" | "Dislike") {}
}

export class CommentSortDataType {
  constructor(
    public postId?: string,
    public pageNumber?: number,
    public pageSize?: number,
    public sortBy?: string,
    public sortDirection?: "asc" | "desc"
  ) {}
}

export class CreateCommentData {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,

    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
    }
  ) {}
}
