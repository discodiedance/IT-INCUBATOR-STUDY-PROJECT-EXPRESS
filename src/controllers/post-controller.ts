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
import {
  CreatePostDataType,
  PostSortDataType,
  UpdatePostDataType,
} from "../types/post/post-dto";
import { BlogRepository } from "../features/infrastructure/repositories/blog-repository";
import { CreatePostLikeData } from "../types/likes/post-likes/post-likes-dto";
import { PostLikesService } from "../features/application/services/post-likes-service";
import { InputLikeDataType } from "../types/likes/input";
import { JwtService } from "../features/application/services/jwt-service";
import { CommentRepository } from "../features/infrastructure/repositories/comment-repository";

@injectable()
export class PostController {
  constructor(
    @inject(CommentRepository) protected CommentRepository: CommentRepository,
    @inject(PostLikesService) protected PostLikesService: PostLikesService,
    @inject(BlogRepository) protected BlogRepository: BlogRepository,
    @inject(PostService) protected PostService: PostService,
    @inject(QueryBlogRepository)
    protected QueryBlogRepository: QueryBlogRepository,
    @inject(PostRepository) protected PostRepository: PostRepository,
    @inject(QueryPostRepository)
    protected QueryPostRepository: QueryPostRepository,
    @inject(JwtService) protected JwtService: JwtService
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

    if (req.user) {
      const posts = await this.QueryPostRepository.getAllPostsWithStatus(
        req.user.id,
        sortData
      );
      res.status(200).send(posts);
      return;
    }
    const posts = await this.QueryPostRepository.getAllPostsWithStatus(
      null,
      sortData
    );
    res.status(200).send(posts);
    return;
  }

  async getPost(req: RequestWithParams<Params>, res: Response) {
    const postId = req.params.id;

    if (req.user) {
      const post =
        await this.QueryPostRepository.getMappedPostByPostIdWithStatus(
          postId,
          req.user.id
        );
      res.status(200).send(post);
      return;
    }

    const post = await this.QueryPostRepository.getMappedPostByPostIdWithStatus(
      postId,
      null
    );
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

    if (req.user) {
      const foundComments = await this.QueryPostRepository.getAllComments(
        req.user.id,
        sortData
      );
      res.status(200).send(foundComments);
      return;
    }

    const foundComments = await this.QueryPostRepository.getAllComments(
      null,
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

    const createPostData: CreatePostDataType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blog.name,
    };

    const post = await this.PostService.createPost(createPostData);

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

    const updatedPost = await this.PostService.updatePost(post, updateData);

    if (!updatedPost) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(204);
    return;
  }

  async putLike(
    req: RequestWithBodyAndParams<PostIdParams, InputLikeDataType>,
    res: Response
  ) {
    const post = await this.PostRepository.getPostByPostId(req.params.postId);
    if (!post) {
      res.sendStatus(404);
      return;
    }

    const createPostLikeData: CreatePostLikeData = {
      post,
      likeStatus: req.body.likeStatus,
      parentId: req.user!.id,
      parentLogin: req.user!.login,
    };

    const likeResult =
      await this.PostLikesService.updatePostLike(createPostLikeData);
    if (!likeResult) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(204);
    return;
  }

  async deletePost(req: RequestWithParams<Params>, res: Response) {
    const id = req.params.id;
    const status = await this.PostRepository.deletePost(id);
    if (!status) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
    return;
  }
}
