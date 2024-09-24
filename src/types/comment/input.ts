export class InputCommentDataType {
  constructor(public content: string) {}
}

export class InputUpdateCommentDataType {
  constructor(public content: string) {}
}

export class InputLikeDataType {
  constructor(public likeStatus: "None" | "Like" | "Dislike") {}
}
