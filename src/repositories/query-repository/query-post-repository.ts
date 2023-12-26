import { ObjectId } from "mongodb";
import { commentCollection, postCollection } from "../../db/db";
import { postMapper } from "../../middlewares/post/post-mapper";
import { OutputPostType } from "../../types/post/output";
import { BlogSortDataType } from "../../types/blog/input";
import { CommentSortDataType } from "../../types/comment/input";
import { commentMapper } from "../../middlewares/comment/comment-mapper";

export class QueryPostRepository {
  static async getAllPosts(sortData: BlogSortDataType) {
    const sortDirection = sortData.sortDirection ?? "desc";
    const sortBy = sortData.sortBy ?? "createdAt";
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const blogId = sortData.blogId;

    let filter = {};

    if (blogId) {
      filter = {
        blogId: blogId,
      };
    }

    const posts = await postCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts.map(postMapper),
    };
  }

  static async getAllComments(sortData: CommentSortDataType) {
    const sortDirection = sortData.sortDirection ?? "desc";
    const sortBy = sortData.sortBy ?? "createdAt";
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const postId = sortData.postId;

    let filter = {};

    if (postId) {
      filter = {
        postId: postId,
      };
    }

    const comments = await commentCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: comments.map(commentMapper),
    };
  }

  static async getPostById(id: string): Promise<OutputPostType | null> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }
}
