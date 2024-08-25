import { Router, Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { authMiddleware } from "../middlewares/auth/auth-basic-middleware";
import {
  Params,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestTypeWithQuery,
  RequestWithBodyAndBlog,
  PostIdParams,
  RequestTypeWithQueryPostId,
  RequestWithCommentBodyAndParams,
} from "../types/common";
import { PostSortDataType, UpdatePostData } from "../types/post/input";
import {
  allCommentsForPostByIdValidation,
  postValidation,
} from "../middlewares/post/post-validation";
import { OutputPostType } from "../types/post/output";
import { QueryPostRepository } from "../repositories/query-repository/query-post-repository";
import { BlogSortDataType } from "../types/blog/input";
import {
  InputCommentBody,
  InputCreateCommentData,
} from "../types/comment/input";
import { PostService } from "../domain/post-service";
import { QueryBlogRepository } from "../repositories/query-repository/query-blog-repository";
import { commentValidation } from "./../middlewares/comment/comment-validation";
import { authTokenMiddleware } from "../middlewares/auth/auth-access-token-middleware";
import { OutputUserType } from "../types/user/output";
import { OutputBlogType } from "../types/blog/output";
import { OutputCommentType } from "../types/comment/output";

export const postRoute = Router({});

postRoute.get(
  "/",
  async (req: RequestTypeWithQuery<BlogSortDataType>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const posts = await QueryPostRepository.getAllPosts(sortData);

    return res.send(posts);
  }
);

postRoute.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
  const id: string = req.params.id;
  const post: OutputPostType | null = await QueryPostRepository.getPostById(id);

  if (!post) {
    res.sendStatus(404);
    return;
  }

  res.send(post);
});

postRoute.get(
  "/:postId/comments",
  allCommentsForPostByIdValidation(),
  async (
    req: RequestTypeWithQueryPostId<PostSortDataType, PostIdParams>,
    res: Response
  ) => {
    const sortData = {
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    };
    const postId: string = req.params.postId;
    const foundComments = await QueryPostRepository.getAllComments({
      ...sortData,
      postId,
    });

    res.send(foundComments);
  }
);

postRoute.post(
  "/",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBodyAndBlog<OutputPostType>, res: Response) => {
    const blog: OutputBlogType | null = await QueryBlogRepository.getBlogById(
      req.body.blogId
    );
    if (!blog) {
      res.sendStatus(404);
      return;
    }

    const post: OutputPostType = await PostService.createPost({
      ...req.body,
      blogName: blog.name,
    });

    return res.status(201).send(post);
  }
);

postRoute.post(
  "/:postId/comments",
  authTokenMiddleware,
  commentValidation(),
  async (
    req: RequestWithCommentBodyAndParams<PostIdParams, InputCommentBody>,
    res: Response
  ) => {
    const user = req.user as OutputUserType;
    const post: OutputPostType | null = await QueryPostRepository.getPostById(
      req.params.postId
    );

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

    const comment: OutputCommentType =
      await PostService.createCommentToPost(createCommentData);
    return res.status(201).send(comment);
  }
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (
    req: RequestWithBodyAndParams<Params, UpdatePostData>,
    res: Response
  ) => {
    const id: string = req.params.id;
    const post: OutputPostType | null =
      await QueryPostRepository.getPostById(id);

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

    await PostRepository.updatePost(id, updateData);
    return res.sendStatus(204);
  }
);

postRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const id: string = req.params.id;
    const status: boolean = await PostRepository.deletePost(id);
    if (!status) {
      res.sendStatus(404);
      return;
    }
    return res.sendStatus(204);
  }
);
