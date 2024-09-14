import { Response } from "express";

import { PostRepository } from "../repositories/post-repository";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { QueryPostRepository } from "../repositories/query-repository/query-post-repository";

import { PostService } from "../domain/post-service";

import { BlogSortDataType } from "../types/blog/input";
import { OutputBlogType } from "../types/blog/output";
import {
  CommentSortDataType,
  InputCommentBody,
  InputCreateCommentData,
} from "../types/comment/input";
import { OutputCommentType } from "../types/comment/output";
import {
  RequestTypeWithQuery,
  RequestWithParams,
  Params,
  RequestTypeWithQueryPostId,
  PostIdParams,
  RequestWithBody,
  RequestWithBodyAndParams,
} from "../types/common";
import { PostSortDataType, UpdatePostData } from "../types/post/input";
import { OutputPostType, PostDBType } from "../types/post/output";
import { OutputUserType } from "../types/user/output";

export class PostController {
  constructor(
    protected PostService: PostService,
    protected QueryBlogRepository: QueryBlogRepository,
    protected PostRepository: PostRepository,
    protected QueryPostRepository: QueryPostRepository
  ) {}

  async getAllPosts(
    req: RequestTypeWithQuery<BlogSortDataType>,
    res: Response
  ) {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const posts = await this.QueryPostRepository.getAllPosts(sortData);

    return res.send(posts);
  }
  async getPost(req: RequestWithParams<Params>, res: Response) {
    const id: string = req.params.id;
    const post: OutputPostType | null =
      await this.QueryPostRepository.getPostById(id);

    if (!post) {
      res.sendStatus(404);
      return;
    }

    res.send(post);
  }
  async getAllCommentsFromPost(
    req: RequestTypeWithQueryPostId<PostSortDataType, PostIdParams>,
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
  async createPost(req: RequestWithBody<PostDBType>, res: Response) {
    const blog: OutputBlogType | null =
      await this.QueryBlogRepository.getBlogById(req.body.blogId);
    if (!blog) {
      res.sendStatus(404);
      return;
    }

    const post: OutputPostType = await this.PostService.createPost({
      ...req.body,
      blogName: blog.name,
    });

    return res.status(201).send(post);
  }
  async createCommentForPost(
    req: RequestWithBodyAndParams<PostIdParams, InputCommentBody>,
    res: Response
  ) {
    const user = req.user as OutputUserType;
    const post: OutputPostType | null =
      await this.QueryPostRepository.getPostById(req.params.postId);
    if (!post) {
      res.sendStatus(404);
      return;
    }

    const createCommentData: InputCreateCommentData = {
      postId: req.params.postId,
      content: req.body.content,
      userId: user.id,
      login: user.login,
    };

    const comment: OutputCommentType | null =
      await this.PostService.createCommentToPost(
        createCommentData,
        req.user!.id
      );
    if (!comment) {
      res.sendStatus(400);
      return;
    }
    res.status(201).send(comment);
    return;
  }
  async updatePost(
    req: RequestWithBodyAndParams<Params, UpdatePostData>,
    res: Response
  ) {
    const id: string = req.params.id;
    const post: OutputPostType | null =
      await this.QueryPostRepository.getPostById(id);

    if (!post) {
      res.sendStatus(404);
      return;
    }

    const updateData: UpdatePostData = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    };

    await this.PostRepository.updatePost(id, updateData);
    return res.sendStatus(204);
  }
  async deletePost(req: RequestWithParams<Params>, res: Response) {
    const id: string = req.params.id;
    const status: boolean = await this.PostRepository.deletePost(id);
    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
}
