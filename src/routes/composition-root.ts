import { BlogController } from "../controllers/blog-controller";
import { CommentController } from "../controllers/comment-controller";
import { PostController } from "../controllers/post-controller";
import { UserController } from "../controllers/user-controller";
import { SecurityController } from "../controllers/security-controller";
import { AuthController } from "../controllers/auth-controller";

import { SecurityRepostiory } from "./../repositories/security-repository";
import { BlogRepository } from "../repositories/blog-repositry";
import { PostRepository } from "../repositories/post-repository";
import { UserRepostitory } from "../repositories/user-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { QueryBlogRepository } from "./../repositories/query-repository/query-blog-repository";
import { QueryCommentLikeRepository } from "./../repositories/query-repository/query-coment-ike-repository";
import { QueryPostRepository } from "./../repositories/query-repository/query-post-repository";
import { QueryUserRepository } from "./../repositories/query-repository/query-user-repository";
import { QuerySecurityRepostiory } from "./../repositories/query-repository/query-security-repository";
import { LikeRepository } from "./../repositories/like-repository";
import { QueryCommentRepository } from "./../repositories/query-repository/query-comment-repository";

import { BlogService } from "../domain/blog-service";
import { CommentService } from "../domain/comment-service";
import { PostService } from "../domain/post-service";
import { UserService } from "../domain/user-service";
import { SecurityService } from "./../domain/security-service";
import { AuthService } from "../domain/auth-service";
import { LikeService } from "./../domain/like-service";
import { JwtService } from "../aplication/jwt-service";

import { EmailsManager } from "../managers/email-manager";
import { EmailAdapter } from "../adapters/email-adapter";

const userRepository = new UserRepostitory();
const securityRepostiory = new SecurityRepostiory();
const postRepository = new PostRepository();
const blogRepository = new BlogRepository();
const commentRepository = new CommentRepository();
const likeRepository = new LikeRepository();

export const queryUserRepository = new QueryUserRepository();
export const querySecurityRepostiory = new QuerySecurityRepostiory();
export const queryPostRepository = new QueryPostRepository();
export const queryBlogRepository = new QueryBlogRepository();
export const queryCommentRepository = new QueryCommentRepository();
export const queryCommentLikeRepository = new QueryCommentLikeRepository();

const emailAdapter = new EmailAdapter();
const emailsManager = new EmailsManager(emailAdapter);

export const jwtService = new JwtService();
const userService = new UserService(userRepository, queryUserRepository);
const securityService = new SecurityService(
  jwtService,
  securityRepostiory,
  querySecurityRepostiory
);
const postService = new PostService(postRepository);
const blogService = new BlogService(
  postService,
  blogRepository,
  queryBlogRepository
);
const commentService = new CommentService(commentRepository);
const likeService = new LikeService(
  likeRepository,
  commentRepository,
  queryCommentLikeRepository
);
const authService = new AuthService(
  emailsManager,
  jwtService,
  userService,
  userRepository,
  securityRepostiory,
  queryUserRepository
);

export const userController = new UserController(
  userRepository,
  userService,
  queryUserRepository
);
export const securityController = new SecurityController(
  securityService,
  jwtService,
  querySecurityRepostiory
);
export const postController = new PostController(
  postService,
  queryBlogRepository,
  postRepository,
  queryPostRepository
);
export const blogController = new BlogController(
  blogService,
  queryBlogRepository,
  blogRepository,
  queryPostRepository
);
export const commentController = new CommentController(
  commentService,
  likeService,
  jwtService,
  queryCommentRepository,
  commentRepository
);
export const authController = new AuthController(
  securityService,
  userService,
  jwtService,
  authService
);
