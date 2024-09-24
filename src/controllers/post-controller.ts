import { Response } from "express";
import { inject, injectable } from "inversify";

import { PostService } from "../features/application/services/post-service";

import { InputCommentDataType } from "../types/comment/input";
import {
  RequestTypeWithQuery,
  RequestWithParams,
  Params,
  RequestTypeWithQueryPostId,
  PostIdParams,
  RequestWithBody,
  RequestWithBodyAndParams,
} from "../types/common";
import {
  InputPostSortDataType,
  InputCreatePostDataType,
  InputUpdatePostDataType,
} from "../types/post/input";
import { OutputUserType } from "../types/user/output";
import { QueryBlogRepository } from "../features/infrastructure/repositories/query-repository/query-blog-repository";
import { PostRepository } from "../features/infrastructure/repositories/post-repository";
import { QueryPostRepository } from "../features/infrastructure/repositories/query-repository/query-post-repository";
import {
  CommentSortDataType,
  CreateCommentToPostDataType,
} from "../types/comment/comment-dto";
import { PostSortDataType, UpdatePostDataType } from "../types/post/post-dto";
import { BlogRepository } from "../features/infrastructure/repositories/blog-repository";

@injectable()
export class PostController {
  constructor(
    @inject(BlogRepository) protected BlogRepository: BlogRepository,
    @inject(PostService) protected PostService: PostService,
    @inject(QueryBlogRepository)
    protected QueryBlogRepository: QueryBlogRepository,
    @inject(PostRepository) protected PostRepository: PostRepository,
    @inject(QueryPostRepository)
    protected QueryPostRepository: QueryPostRepository
  ) {}

  async getAllPosts(
    req: RequestTypeWithQuery<InputPostSortDataType>,
    res: Response
  ) {
    const sortData: PostSortDataType = {
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    };

    const posts = await this.QueryPostRepository.getAllPosts(sortData);

    res.send(posts);
    return;
  }

  async getPost(req: RequestWithParams<Params>, res: Response) {
    const id = req.params.id;
    const post = await this.QueryPostRepository.getMappedPostByPostId(id);

    if (!post) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(post);
    return;
  }

  async getAllCommentsFromPost(
    req: RequestTypeWithQueryPostId<InputPostSortDataType, PostIdParams>,
    res: Response
  ) {
    const sortData: CommentSortDataType = {
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      postId: req.params.postId,
    };

    if (!req.headers.authorization) {
      const foundComments = await this.QueryPostRepository.getAllComments(
        "",
        sortData
      );
      res.status(200).send(foundComments);
      return;
    }

    const userId = req.user!.id;
    const foundComments = await this.QueryPostRepository.getAllComments(
      userId,
      sortData
    );

    res.status(200).send(foundComments);
    return;
  }

  async createPost(
    req: RequestWithBody<InputCreatePostDataType>,
    res: Response
  ) {
    const blog = await this.BlogRepository.getBlogByBlogId(req.body.blogId);

    if (!blog) {
      res.sendStatus(404);
      return;
    }

    const post = await this.PostService.createPost({
      ...req.body,
      blogName: blog.name,
    });

    if (!post) {
      res.sendStatus(500);
      return;
    }

    res.status(201).send(post);
    return;
  }

  async createCommentForPost(
    req: RequestWithBodyAndParams<PostIdParams, InputCommentDataType>,
    res: Response
  ) {
    const user = req.user as OutputUserType;
    const post = await this.QueryPostRepository.getMappedPostByPostId(
      req.params.postId
    );

    if (!post) {
      res.sendStatus(404);
      return;
    }

    const createCommentData: CreateCommentToPostDataType = {
      postId: req.params.postId,
      content: req.body.content,
      userId: user.id,
      login: user.login,
    };

    const comment =
      await this.PostService.createCommentToPost(createCommentData);

    if (!comment) {
      res.sendStatus(500);
      return;
    }

    res.status(201).send(comment);
    return;
  }

  async updatePost(
    req: RequestWithBodyAndParams<Params, InputUpdatePostDataType>,
    res: Response
  ) {
    const id = req.params.id;
    const post = await this.PostRepository.getPostByPostId(id);

    if (!post) {
      res.sendStatus(404);
      return;
    }

    const updateData: UpdatePostDataType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    };

    await this.PostService.updatePost(post, updateData);
    return res.sendStatus(204);
  }

  async deletePost(req: RequestWithParams<Params>, res: Response) {
    const id = req.params.id;
    const status = await this.PostRepository.deletePost(id);
    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
}
