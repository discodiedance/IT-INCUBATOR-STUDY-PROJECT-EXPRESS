import { CommentModel, PostModel } from "../../db/db";
import { postMapper } from "../../middlewares/post/post-mapper";
import { commentMapperWithStatus } from "../../middlewares/comment/comment-mapper";
import { OutputPostType, PostDBType } from "../../types/post/output";
import { BlogSortDataType } from "../../types/blog/input";
import { CommentSortDataType } from "../../types/comment/input";

export class QueryPostRepository {
  async getAllPosts(sortData: BlogSortDataType) {
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

    const posts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts.map(postMapper),
    };
  }

  async getAllComments(userId: string, sortData: CommentSortDataType) {
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

    const comments = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount = await CommentModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: await Promise.all(
        comments.map((comment) => commentMapperWithStatus(comment, userId))
      ),
    };
  }

  async getPostById(postId: string): Promise<OutputPostType | null> {
    const post: PostDBType | null = await PostModel.findOne({ id: postId });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }
}
