import request from "supertest";
import { app } from "../../src/settings";
import mongoose from "mongoose";
import {
  postLikesRepository,
  queryPostRepository,
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
  describe(postRouterName, () => {
    beforeAll(async () => {
      await request(app).delete("/testing/all-data");
    });

    let testUser1: any;
    let testUser2: any;
    let testUser3: any;
    let testUser4: any;
    let testUser5: any;
    let testUser6: any;
    let testAuthUser1: any;
    let testAuthUser2: any;
    let testAuthUser3: any;
    let testAuthUser4: any;
    let testAuthUser5: any;
    let testAuthUser6: any;
    let testBlog1Id: any;
    let testPost1Id: any;

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

    it("Create testUser4 for tests)", async () => {
      //create testUser4
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send({
          login: "good4",
          password: "goodpassword4",
          email: "goodmail4@mail.ru",
        })
        .expect(201);
      testUser4 = res.body;
    });

    it("Create testUser5 for tests)", async () => {
      //create testUser5
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send({
          login: "good5",
          password: "goodpassword5",
          email: "goodmail5@mail.ru",
        })
        .expect(201);
      testUser5 = res.body;
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

    it("Create testAuth4 for tests", async () => {
      //create testAuth4
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser4.login,
          password: "goodpassword4",
        })
        .expect(200);
      testAuthUser4 = res.body;
    });

    it("Create testAuth5 for tests", async () => {
      //create testAuth5
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser5.login,
          password: "goodpassword5",
        })
        .expect(200);
      testAuthUser5 = res.body;
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser1", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser1.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser1.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(1);
      expect(post!.extendedLikesInfo.newestLikes[0]).toEqual({
        addedAt: expect.any(String),
        userId: testUser1.id,
        login: testUser1.login,
      });
    });

    it("204 and send status none to testPost1(owner testUser1) by logined testUser1", async () => {
      //send none status to post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "None" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser1.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser1.id
      );
      expect(likeInfo == null).toBeNull;
      expect(post!.extendedLikesInfo.likesCount).toEqual(0);
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.myStatus).toEqual("None");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
      expect(post!.extendedLikesInfo.newestLikes[0]).toBeNull;
    });

    it("204 and disliked testPost1(owner testUser1) by logined testUser1", async () => {
      //dislike post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "Dislike" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser1.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser1.id
      );
      expect(likeInfo!.status).toEqual("Dislike");
      expect(post!.extendedLikesInfo.likesCount).toEqual(0);
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Dislike");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
      expect(post!.extendedLikesInfo.newestLikes[0]).toBeNull;
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser1", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser1.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser1.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser1.id
      );

      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
      expect(post!.extendedLikesInfo.newestLikes[0]).toBeNull;
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser2", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser2.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser2.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser2.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(2);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(1);
      expect(post!.extendedLikesInfo.newestLikes[0]).toEqual({
        addedAt: expect.any(String),
        userId: testUser2.id,
        login: testUser2.login,
      });
    });

    it("204 and send status none to testPost1(owner testUser1) by logined testUser2", async () => {
      //send none status to post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser2.accessToken)
        .send({ likeStatus: "None" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser2.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser2.id
      );
      expect(likeInfo!.status).toEqual("None");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("None");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
    });

    it("204 and not liked testPost1(owner testUser1) by unauthorized", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + "badAcessToken")
        .send({ likeStatus: "Like" });
      expect(401);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        "null",
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        "null"
      );
      expect(likeInfo).toBeNull();
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("None");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
    });

    it("204 and not disliked testPost1(owner testUser1) by unauthorized", async () => {
      //dislike post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + "badAcessToken")
        .send({ likeStatus: "Dislike" });
      expect(401);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        "null",
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        "null"
      );
      expect(likeInfo).toBeNull();
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("None");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
    });

    it("204 and send status none to testPost1(owner testUser1) by unauthorized", async () => {
      //dislike post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + "badAcessToken")
        .send({ likeStatus: "None" });
      expect(401);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        "null",
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        "null"
      );
      expect(likeInfo).toBeNull();
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("None");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
    });

    it("400 and not liked testPost1(owner testUser1) by testUser3 with invalid status by testUser3", async () => {
      //send bad like status
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser3)
        .send({ likeStatus: "BadStatus" });
      expect(400);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser3.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser3.id
      );
      expect(likeInfo).toBeNull();
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(1);
      expect(post!.extendedLikesInfo.myStatus).toEqual("None");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
    });

    it("404 and not liked not existing post by logined testUser3", async () => {
      //like post1
      await request(app)
        .put(commentRouterName + "/" + "0" + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser3)
        .send({ likeStatus: "Like" });
      expect(404);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser3.id,
        "0"
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        "0",
        testUser3.id
      );
      expect(likeInfo).toBeNull();
      expect(post).toBeNull();
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser2", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser2.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser2.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser2.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(2);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(0);
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser3", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser3.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser3.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser3.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(3);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(1);
      expect(post!.extendedLikesInfo.newestLikes[0]).toEqual({
        addedAt: expect.any(String),
        userId: testUser3.id,
        login: testUser3.login,
      });
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser4", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser4.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser4.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser4.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(4);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(2);
      expect(post!.extendedLikesInfo.newestLikes[0]).toEqual({
        addedAt: expect.any(String),
        userId: testUser4.id,
        login: testUser4.login,
      });
      expect(post!.extendedLikesInfo.newestLikes[1]).toEqual({
        addedAt: expect.any(String),
        userId: testUser3.id,
        login: testUser3.login,
      });
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser5", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser5.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser5.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser5.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(5);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(3);
      expect(post!.extendedLikesInfo.newestLikes[0]).toEqual({
        addedAt: expect.any(String),
        userId: testUser5.id,
        login: testUser5.login,
      });
      expect(post!.extendedLikesInfo.newestLikes[1]).toEqual({
        addedAt: expect.any(String),
        userId: testUser4.id,
        login: testUser4.login,
      });
      expect(post!.extendedLikesInfo.newestLikes[2]).toEqual({
        addedAt: expect.any(String),
        userId: testUser3.id,
        login: testUser3.login,
      });
    });

    it("Create testUser6 for tests)", async () => {
      //create testUser6
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send({
          login: "good6",
          password: "goodpassword6",
          email: "goodmail6@mail.ru",
        })
        .expect(201);
      testUser6 = res.body;
    });

    it("Create testAuth6 for tests", async () => {
      //create testAuth6
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser6.login,
          password: "goodpassword6",
        })
        .expect(200);
      testAuthUser6 = res.body;
    });

    it("204 and liked testPost1(owner testUser1) by logined testUser6 and got only first 3 newlikes", async () => {
      //like post1
      await request(app)
        .put(postRouterName + "/" + testPost1Id + "/like-status")
        .set("Authorization", "Bearer " + testAuthUser6.accessToken)
        .send({ likeStatus: "Like" })
        .expect(204);
      const likeInfo = await postLikesRepository.getLikeDataByParentIdAndPostId(
        testUser6.id,
        testPost1Id
      );
      const post = await queryPostRepository.getMappedPostByPostIdWithStatus(
        testPost1Id,
        testUser6.id
      );
      expect(likeInfo!.status).toEqual("Like");
      expect(post!.extendedLikesInfo.dislikesCount).toEqual(0);
      expect(post!.extendedLikesInfo.likesCount).toEqual(6);
      expect(post!.extendedLikesInfo.myStatus).toEqual("Like");
      expect(post!.extendedLikesInfo.newestLikes.length).toEqual(3);
      expect(post!.extendedLikesInfo.newestLikes[0]).toEqual({
        addedAt: expect.any(String),
        userId: testUser6.id,
        login: testUser6.login,
      });
      expect(post!.extendedLikesInfo.newestLikes[1]).toEqual({
        addedAt: expect.any(String),
        userId: testUser5.id,
        login: testUser5.login,
      });
      expect(post!.extendedLikesInfo.newestLikes[2]).toEqual({
        addedAt: expect.any(String),
        userId: testUser4.id,
        login: testUser4.login,
      });
      expect(post!.extendedLikesInfo.newestLikes[3]).toBeUndefined();
    });
  });
});
