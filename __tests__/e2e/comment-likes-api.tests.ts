import request from "supertest";
import { app } from "../../src/settings";
import mongoose from "mongoose";
import {
  commentLikesRepository,
  queryCommentRepository,
} from "../../src/routes/composition-root";

const commentRouterName = "/comments";
const blogRouterName = "/blogs";
const postRouterName = "/posts";
const userRouterName = "/users";
const authRouterName = "/auth";

const login = "admin";
const password = "qwerty";

describe("Mongoose integration", () => {
  const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/minigram`;

  beforeAll(async () => {
    await mongoose.connect(mongoURI);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe(commentRouterName, () => {
    beforeAll(async () => {
      await request(app).delete("/testing/all-data");
    });

    let testUser1: any;
    let testUser2: any;
    let testUser3: any;
    let testAuthUser1: any;
    let testAuthUser2: any;
    let testAuthUser3: any;
    let testBlog1Id: any;
    let testPost1Id: any;
    let testComment1Id: any;

    it("Create testBlog1 for tests", async () => {
      //create testBlog1
      const res = await request(app)
        .post(blogRouterName)
        .auth(login, password)
        .send({
          name: "Blog",
          description: "Description Blog",
          websiteUrl: "https://www.blog.com",
        })
        .expect(201);
      testBlog1Id = res.body.id;
    });

    it("Create testPost1 for tests", async () => {
      //create testPost1
      const res = await request(app)
        .post(postRouterName)
        .auth(login, password)
        .send({
          title: "titleTest",
          shortDescription: "shortDescriptionTest",
          content: "contentTest",
          blogId: testBlog1Id,
        })
        .expect(201);
      testPost1Id = res.body.id;
    });

    it("Create testUser1 for tests)", async () => {
      //create testUser1
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send({
          login: "good1",
          password: "goodpassword1",
          email: "goodmail1@mail.ru",
        })
        .expect(201);
      testUser1 = res.body;
    });

    it("Create testUser2 for tests)", async () => {
      //create testUser2
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send({
          login: "good2",
          password: "goodpassword2",
          email: "goodmail2@mail.ru",
        })
        .expect(201);
      testUser2 = res.body;
    });

    it("Create testUser3 for tests)", async () => {
      //create testUser3
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send({
          login: "good3",
          password: "goodpassword3",
          email: "goodmail3@mail.ru",
        })
        .expect(201);
      testUser3 = res.body;
    });

    it("Create testAuth1 for tests", async () => {
      //create testAuth1
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser1.login,
          password: "goodpassword1",
        })
        .expect(200);
      testAuthUser1 = res.body;
    });

    it("Create testAuth2 for tests", async () => {
      //create testAuth2
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser2.login,
          password: "goodpassword2",
        })
        .expect(200);
      testAuthUser2 = res.body;
    });

    it("Create testAuth3 for tests", async () => {
      //create testAuth3
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser3.login,
          password: "goodpassword3",
        })
        .expect(200);
      testAuthUser3 = res.body;
    });

    it("Create testComment1 for tests", async () => {
      //create testComment1
      const res = await request(app)
        .post(postRouterName + "/" + testPost1Id + "/" + "comments")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({
          content: "hellohellohellohellohellohello",
        })
        .expect(201);
      await request(app)
        .get(commentRouterName + "/" + res.body.id)
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .expect(200);
      testComment1Id = res.body.id;
    });

    it("204 and liked testComment1(owner testUser1) by logined testUser1", async () => {
      //like comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser1.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser1.id
        );
      expect(
        likeInfo!.status == "Like" &&
          commentCount!.likesInfo.dislikesCount == 0 &&
          commentCount!.likesInfo.likesCount == 1
      );
    });

    it("204 and send status none to testComment1(owner testUser1) by logined testUser1", async () => {
      //send none status to comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "None" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser1.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser1.id
        );
      expect(
        likeInfo == null &&
          commentCount!.likesInfo.likesCount == 0 &&
          commentCount!.likesInfo.dislikesCount == 0
      );
    });

    it("204 and disliked testComment1(owner testUser1) by logined testUser1", async () => {
      //dislike comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "Dislike" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser1.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser1.id
        );
      expect(
        likeInfo!.status == "Dislike" &&
          commentCount!.likesInfo.likesCount == 0 &&
          commentCount!.likesInfo.dislikesCount == 1
      );
    });

    it("204 and liked testComment1(owner testUser1) by logined testUser1", async () => {
      //like comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser1.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser1.id
        );
      expect(
        likeInfo!.status == "Like" &&
          commentCount!.likesInfo.dislikesCount == 0 &&
          commentCount!.likesInfo.likesCount == 1
      );
    });

    it("204 and disliked testComment1(owner testUser1) by logined testUser2", async () => {
      //dislike comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser2.accessToken)
        .send({ likeStatus: "Dislike" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser2.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser2.id
        );
      expect(
        likeInfo!.status == "Dislike" &&
          commentCount!.likesInfo.likesCount == 1 &&
          commentCount!.likesInfo.dislikesCount == 1
      );
    });

    it("204 and liked testComment1(owner testUser1) by logined testUser2", async () => {
      //like comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser2.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser2.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser2.id
        );
      expect(
        likeInfo!.status == "Like" &&
          commentCount!.likesInfo.dislikesCount == 0 &&
          commentCount!.likesInfo.likesCount == 2
      );
    });

    it("204 and send status none to testComment1(owner testUser1) by logined testUser2", async () => {
      //send none status to comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser2.accessToken)
        .send({ likeStatus: "None" })
        .expect(204);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser2.id,
          testComment1Id
        );
      const commentCount =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser2.id
        );
      expect(
        likeInfo == null &&
          commentCount!.likesInfo.likesCount == 1 &&
          commentCount!.likesInfo.dislikesCount == 0
      );
    });

    it("204 and not liked testComment1(owner testUser1) by unauthorized", async () => {
      //like comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + "badAcessToken")
        .send({ likeStatus: "Like" });
      expect(401);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          "null",
          testComment1Id
        );
      const comment =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          "null"
        );
      expect(
        comment!.likesInfo.myStatus == null &&
          comment!.likesInfo.likesCount == 1 &&
          comment!.likesInfo.dislikesCount == 0 &&
          likeInfo == null
      );
    });

    it("204 and not disliked testComment1(owner testUser1) by unauthorized", async () => {
      //dislike comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + "badAcessToken")
        .send({ likeStatus: "Dislike" });
      expect(401);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          "null",
          testComment1Id
        );
      const comment =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          "null"
        );
      expect(
        comment!.likesInfo.myStatus == null &&
          comment!.likesInfo.likesCount == 1 &&
          comment!.likesInfo.dislikesCount == 0 &&
          likeInfo == null
      );
    });

    it("204 and send status none to testComment1(owner testUser1) by unauthorized", async () => {
      //send status none to comment1
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + "badAcessToken")
        .send({ likeStatus: "None" });
      expect(401);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          "null",
          testComment1Id
        );
      const comment =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          "null"
        );
      expect(
        comment!.likesInfo.myStatus == null &&
          comment!.likesInfo.likesCount == 1 &&
          comment!.likesInfo.dislikesCount == 0 &&
          likeInfo == null
      );
    });

    it("400 and not liked testComment1(owner testUser1) by testUser3 with invalid status", async () => {
      //send bad like status
      await request(app)
        .put(commentRouterName + "/" + testComment1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser3)
        .send({ likeStatus: "BadStatus" });
      expect(400);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser3.id,
          testComment1Id
        );
      const comment =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser3.id
        );
      expect(
        comment!.likesInfo.myStatus == null &&
          comment!.likesInfo.likesCount == 1 &&
          comment!.likesInfo.dislikesCount == 0 &&
          likeInfo == null
      );
    });

    it("404 and not liked not existing comment by logined testUser3", async () => {
      //like comment
      await request(app)
        .put(commentRouterName + "/" + "0" + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser3)
        .send({ likeStatus: "Like" });
      expect(404);
      const likeInfo =
        await commentLikesRepository.getLikeDataByParentIdAndCommentId(
          testUser3.id,
          testComment1Id
        );
      const comment =
        await queryCommentRepository.getMappedCommentByCommentIdWithStatus(
          testComment1Id,
          testUser3.id
        );
      expect(
        comment!.likesInfo.myStatus == null &&
          comment!.likesInfo.likesCount == 1 &&
          comment!.likesInfo.dislikesCount == 0 &&
          likeInfo == null
      );
    });
  });
});
