import request from "supertest";
import { app } from "./../../src/settings";

const routerName = "/comments";
const postRouterName = "/posts";
const blogRouterName = "/blogs";
const authRouterName = "/auth";
const userRouterName = "/users";

const login = "admin";
const password = "qwerty";

const correctBlogData = {
  name: "Blog",
  description: "Description Blog",
  websiteUrl: "https://www.blog.com",
};

const correctPostData = {
  title: "titleTest",
  shortDescription: "shortDescriptionTest",
  content: "contentTest",
  blogId: "blogIdTest",
};

const correctUserData1 = {
  login: "good1",
  password: "goodpassword1",
  email: "goodmail1@mail.ru",
};

const correctUserData2 = {
  login: "good2",
  password: "goodpassword2",
  email: "goodmail2@mail.ru",
};

const correctUserData3 = {
  login: "good3",
  password: "goodpassword3",
  email: "goodmail3@mail.ru",
};

const correctCommentData = {
  content: "hellohellohellohellohellohello",
};

const correctUpdateCommentData = {
  content: "content123content123content123",
};

const incorrectUpdateCommentData = {
  content: "",
};

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  let testBlogId: string;
  let testPostId: string;
  let testUser: any;
  let testAuth: any;
  let testComment: any;

  it("Create testBlog for tests", async () => {
    const res = await request(app)
      .post(blogRouterName)
      .auth(login, password)
      .send(correctBlogData)
      .expect(201);
    testBlogId = res.body.id;
  });
  it("Create testPost for tests", async () => {
    const res = await request(app)
      .post(postRouterName)
      .auth(login, password)
      .send({ ...correctPostData, blogId: testBlogId })
      .expect(201);
    testPostId = res.body.id;
  });
  it("Create testUser for tests)", async () => {
    const res = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData1)
      .expect(201);
    testUser = res.body;
  });
  it("Create testAuth for tests", async () => {
    const res = await request(app)
      .post(authRouterName + "/" + "login")
      .send({
        loginOrEmail: testUser.login,
        password: correctUserData1.password,
      })
      .expect(200);
    testAuth = res.body;
  });
  it("Create testComment for tests", async () => {
    const res = await request(app)
      .post(postRouterName + "/" + testPostId + "/" + "comments")
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .send(correctCommentData)
      .expect(201);
    await request(app)
      .get(routerName + "/" + res.body.id)
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .expect(200);
    testComment = res.body;
  });
  it("404 and not founded comment for a user with a correct data", async () => {
    await request(app)
      .get(routerName + "/" + "01010")
      .expect(404);
  });
  it("200 and founded comment for a user with a correct data", async () => {
    await request(app)
      .get(routerName + "/" + testComment.id)
      .expect(200);
  });
  it("401 and not updated comment with unauthorized (JWT token)", async () => {
    await request(app)
      .put(routerName + "/" + testComment.id)
      .set("Authorization", "Bearer " + "as362sad2Eyik2")
      .send({ ...correctUpdateCommentData, postId: testPostId })
      .expect(401);
  });
  it("400 and not updated comment with incorrect data", async () => {
    await request(app)
      .put(routerName + "/" + testComment.id)
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .send({ ...incorrectUpdateCommentData, postId: testPostId })
      .expect(400, {
        errorsMessages: [{ message: "Incorrect value", field: "content" }],
      });
  });
  it("404 and not updated comment with not found comment", async () => {
    await request(app)
      .put(routerName + "/" + "123123123")
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .send({ ...correctUpdateCommentData, postId: testPostId })
      .expect(404);
  });
  it("403 and not updated comment with not right logged user", async () => {
    const blog = await request(app)
      .post(blogRouterName)
      .auth(login, password)
      .send(correctBlogData)
      .expect(201);
    const post = await request(app)
      .post(postRouterName)
      .auth(login, password)
      .send({ ...correctPostData, blogId: blog.body.id })
      .expect(201);
    const user = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData2)
      .expect(201);
    const auth = await request(app)
      .post(authRouterName + "/" + "login")
      .send({
        loginOrEmail: user.body.login,
        password: correctUserData2.password,
      })
      .expect(200);
    const comment = await request(app)
      .post(postRouterName + "/" + post.body.id + "/" + "comments")
      .set("Authorization", "Bearer " + auth.body.accessToken)
      .send(correctCommentData)
      .expect(201);
    const user2 = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData3)
      .expect(201);
    const auth2 = await request(app)
      .post(authRouterName + "/" + "login")
      .send({
        loginOrEmail: user2.body.login,
        password: correctUserData3.password,
      })
      .expect(200);
    await request(app)
      .put(routerName + "/" + comment.body.id)
      .set("Authorization", "Bearer " + auth2.body.accessToken)
      .send({ ...correctUpdateCommentData, postId: post.body.id })
      .expect(403);
  });
  it("204 and updated comment with correct data", async () => {
    await request(app)
      .put(routerName + "/" + testComment.id)
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .send({ ...correctUpdateCommentData, postId: testPostId })
      .expect(204);
  });
  it("401 and not deleted comment with unauthorized JWT", async () => {
    await request(app)
      .delete(routerName + "/" + testComment.id)
      .set("Authorization", "Bearer " + "sae131ffas")
      .expect(401);
  });
  it("404 and not deleted comment with not found comment", async () => {
    await request(app)
      .delete(routerName + "/" + "10110")
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .expect(404);
  });
  it("403 and not deleted comment with not right logged user", async () => {
    const blog = await request(app)
      .post(blogRouterName)
      .auth(login, password)
      .send(correctBlogData)
      .expect(201);
    const post = await request(app)
      .post(postRouterName)
      .auth(login, password)
      .send({ ...correctPostData, blogId: blog.body.id })
      .expect(201);
    const user = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData2)
      .expect(201);
    const auth = await request(app)
      .post(authRouterName + "/" + "login")
      .send({
        loginOrEmail: user.body.login,
        password: correctUserData2.password,
      })
      .expect(200);
    const comment = await request(app)
      .post(postRouterName + "/" + post.body.id + "/" + "comments")
      .set("Authorization", "Bearer " + auth.body.accessToken)
      .send(correctCommentData)
      .expect(201);
    const user2 = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData3)
      .expect(201);
    const auth2 = await request(app)
      .post(authRouterName + "/" + "login")
      .send({
        loginOrEmail: user2.body.login,
        password: correctUserData3.password,
      })
      .expect(200);
    await request(app)
      .delete(routerName + "/" + comment.body.id)
      .set("Authorization", "Bearer " + auth2.body.accessToken)
      .expect(403);
  });
  it("204 and deleted comment", async () => {
    await request(app)
      .delete(routerName + "/" + testComment.id)
      .set("Authorization", "Bearer " + testAuth.accessToken)
      .expect(204);
  });
});
