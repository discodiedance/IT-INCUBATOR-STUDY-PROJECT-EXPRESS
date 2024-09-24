import { injectable } from "inversify";

import { PostDocumentType } from "../../../../types/post/post-entities";

import { OutputPostType } from "../../../../types/post/output";
import { CommentModel } from "../../../domain/entities/comment-enitity";
import { PostModel } from "../../../domain/entities/post-entity";

import { CommentSortDataType } from "../../../../types/comment/comment-dto";
import { PostSortDataType } from "../../../../types/post/post-dto";
import { commentMapperWithStatus } from "../../../application/mappers/comment/comment-mapper";
import { postMapper } from "../../../application/mappers/post/post-mapper";

@injectable()
export class QueryPostRepository {
  async getAllPosts(sortData: PostSortDataType) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "desc";
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
      .limit(+pageSize);

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
      .limit(+pageSize);

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

  async getMappedPostByPostId(postId: string): Promise<OutputPostType | null> {
    const post: PostDocumentType | null = await PostModel.findOne({
      id: postId,
    });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }
}
