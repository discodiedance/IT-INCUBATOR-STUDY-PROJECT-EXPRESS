import "reflect-metadata";
import { Container } from "inversify";
import { BlogController } from "../controllers/blog-controller";
import { CommentController } from "../controllers/comment-controller";
import { PostController } from "../controllers/post-controller";
import { UserController } from "../controllers/user-controller";
import { SecurityController } from "../controllers/device-controller";
import { AuthController } from "../controllers/auth-controller";
import { EmailsManager } from "../features/application/managers/email-manager";
import { AuthService } from "../features/application/services/auth-service";
import { BlogService } from "../features/application/services/blog-service";
import { CommentService } from "../features/application/services/comment-service";
import { JwtService } from "../features/application/services/jwt-service";
import { PostService } from "../features/application/services/post-service";
import { SecurityService } from "../features/application/services/security-service";
import { UserService } from "../features/application/services/user-service";
import { EmailAdapter } from "../features/infrastructure/adapters/email-adapter";
import { BlogRepository } from "../features/infrastructure/repositories/blog-repository";
import { CommentRepository } from "../features/infrastructure/repositories/comment-repository";
import { PostRepository } from "../features/infrastructure/repositories/post-repository";
import { QueryBlogRepository } from "../features/infrastructure/repositories/query-repository/query-blog-repository";
import { QueryCommentRepository } from "../features/infrastructure/repositories/query-repository/query-comment-repository";
import { QueryPostRepository } from "../features/infrastructure/repositories/query-repository/query-post-repository";
import { QuerySecurityRepository } from "../features/infrastructure/repositories/query-repository/query-security-repository";
import { QueryUserRepository } from "../features/infrastructure/repositories/query-repository/query-user-repository";
import { UserRepository } from "../features/infrastructure/repositories/user-repository";
import { CommentLikesRepository } from "../features/infrastructure/repositories/comment-likes-repository";
import { SecurityRepository } from "../features/infrastructure/repositories/security-repository";
import { PostLikesRepository } from "../features/infrastructure/repositories/post-likes-repository";
import { CommentLikesService } from "../features/application/services/comment-likes-service";
import { PostLikesService } from "../features/application/services/post-likes-service";

const ioc = new Container();

ioc.bind<UserRepository>(UserRepository).to(UserRepository);
ioc.bind<SecurityRepository>(SecurityRepository).to(SecurityRepository);
ioc.bind<PostRepository>(PostRepository).to(PostRepository);
ioc.bind<BlogRepository>(BlogRepository).to(BlogRepository);
ioc.bind<CommentRepository>(CommentRepository).to(CommentRepository);
ioc
  .bind<CommentLikesRepository>(CommentLikesRepository)
  .to(CommentLikesRepository);
ioc.bind<QueryUserRepository>(QueryUserRepository).to(QueryUserRepository);
ioc
  .bind<QuerySecurityRepository>(QuerySecurityRepository)
  .to(QuerySecurityRepository);
ioc.bind<QueryPostRepository>(QueryPostRepository).to(QueryPostRepository);
ioc.bind<QueryBlogRepository>(QueryBlogRepository).to(QueryBlogRepository);
ioc
  .bind<QueryCommentRepository>(QueryCommentRepository)
  .to(QueryCommentRepository);
ioc.bind<PostLikesRepository>(PostLikesRepository).to(PostLikesRepository);

ioc.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter);
ioc.bind<EmailsManager>(EmailsManager).to(EmailsManager);
ioc.bind<JwtService>(JwtService).to(JwtService);
ioc.bind<UserService>(UserService).to(UserService);
ioc.bind<SecurityService>(SecurityService).to(SecurityService);
ioc.bind<PostService>(PostService).to(PostService);
ioc.bind<BlogService>(BlogService).to(BlogService);
ioc.bind<CommentService>(CommentService).to(CommentService);
ioc.bind<CommentLikesService>(CommentLikesService).to(CommentLikesService);
ioc.bind<PostLikesService>(PostLikesService).to(PostLikesService);
ioc.bind<AuthService>(AuthService).to(AuthService);
ioc.bind<UserController>(UserController).to(UserController);
ioc.bind<SecurityController>(SecurityController).to(SecurityController);
ioc.bind<PostController>(PostController).to(PostController);
ioc.bind<BlogController>(BlogController).to(BlogController);
ioc.bind<CommentController>(CommentController).to(CommentController);
ioc.bind<AuthController>(AuthController).to(AuthController);

export const userController = ioc.get(UserController);
export const securityController = ioc.get(SecurityController);
export const postController = ioc.get(PostController);
export const commentController = ioc.get(CommentController);
export const blogController = ioc.get(BlogController);
export const authController = ioc.get(AuthController);

export const commentRepository = ioc.get(CommentRepository);
export const postLikesRepository = ioc.get(PostLikesRepository);
export const commentLikesRepository = ioc.get(CommentLikesRepository);
export const securityRepository = ioc.get(SecurityRepository);

export const queryBlogRepository = ioc.get(QueryBlogRepository);
export const queryUserRepository = ioc.get(QueryUserRepository);
export const queryCommentRepository = ioc.get(QueryCommentRepository);
export const queryPostRepository = ioc.get(QueryPostRepository);

export const jwtService = ioc.get(JwtService);
