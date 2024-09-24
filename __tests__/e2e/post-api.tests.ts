import request from "supertest";
import { app } from "../../src/settings";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const routerName = "/posts";
const userRouterName = "/users";
const authRouterName = "/auth";

const login = "admin";
const password = "qwerty";

const correctPostData = {
  title: "titleTest",
  shortDescription: "shortDescriptionTest",
  content: "contentTest",
  blogId: "blogIdTest",
};

const correctUpdatePostData = {
  title: "updateTitle",
  shortDescription: "updateShortDescription",
  content: "updateContent",
};

const incorrectPostData = {
  title: "   ",
  shortDescription: "badbadbadbadbadbadbadbadbadbadbadbadbadbadbadbad",
  content: "",
};

const emptyPostData = {
  title: "",
  shortDescription: "",
  content: "",
  blogId: "",
};

const overLengthPostData = {
  title: "11111111111111111111111111111111111111111111111111111111111",
  shortDescription:
    "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
  content: "contentforpost",
  blogId: "asdasdasdasdasdasdasdasd",
};

const correctCommentData = {
  content: "hellohellohellohellohellohello",
};

const incorrectCommentData = {
  content: "",
};

const correctUserData = {
  login: "good",
  password: "goodpassword",
  email: "goodmail@mail.ru",
};

describe("Mongoose integration", () => {
  const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/minigram`;

  beforeAll(async () => {
    /* Connecting to the database. */
    await mongoose.connect(mongoURI);
  });
  afterAll(async () => {
    /* Closing database connection after each test. */
    await mongoose.connection.close();
  });

  describe(routerName, () => {
    beforeAll(async () => {
      await request(app).delete("/testing/all-data");
    });

    let testBlogId1: string;
    let testBlogId2: string;
    let testPost1: any;
    let testPost2: any;
    let testAuth: any;
    let testUser: any;

    it("200 and empy array of posts", async () => {
      //get posts
      await request(app).get(routerName).expect(200);
    });

    it("Create testUser for tests)", async () => {
      //create testUser
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send(correctUserData)
        .expect(201);
      testUser = res.body;
    });

    it("Create testAuth for tests", async () => {
      //login testAuth
      const res = await request(app)
        .post(authRouterName + "/" + "login")
        .send({
          loginOrEmail: testUser.login,
          password: correctUserData.password,
        })
        .expect(200);
      testAuth = res.body;
    });

    it("Create testBlog1 for test posts", async () => {
      //create testBlog1
      const res = await request(app)
        .post("/blogs")
        .auth(login, password)
        .send({
          name: "Blog1",
          description: "Description Blog1",
          websiteUrl: "https://www.blog.com",
        })
        .expect(201);
      testBlogId1 = res.body.id;
    });

    it("Create testBlog2 for test posts2", async () => {
      //create testBlog2
      const res = await request(app)
        .post("/blogs")
        .auth(login, password)
        .send({
          name: "Blog2",
          description: "Description Blog2",
          websiteUrl: "https://www.blog.com",
        })
        .expect(201);
      testBlogId2 = res.body.id;
    });

    it("400 and not created post with empty data", async () => {
      //create post
      await request(app)
        .post(routerName)
        .auth(login, password)
        .send({
          ...emptyPostData,
          blogId: testBlogId1,
        })
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "title" },
            { message: "Incorrect value", field: "shortDescription" },
            { message: "Incorrect value", field: "content" },
          ],
        });
      //get posts
      await request(app).get(routerName).expect(200);
    });

    it("400 and not created post with overlength title and shortdescription", async () => {
      //create post
      await request(app)
        .post(routerName)
        .auth(login, password)
        .send({
          ...overLengthPostData,
          blogId: testBlogId1,
        })
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "title" },
            { message: "Incorrect value", field: "shortDescription" },
          ],
        });
      //get posts
      await request(app).get(routerName).expect(200);
    });

    it("401 and not created post with incorrect authorization", async () => {
      //create post
      await request(app)
        .post(routerName)
        .auth("badlogin", "badpassword")
        .send({
          ...correctPostData,
          blogId: testBlogId1,
        })
        .expect(401);
      //get posts
      await request(app).get(routerName).expect(200);
    });

    it("400 and not created post with incorrect blog id", async () => {
      //create post
      await request(app)
        .post(routerName)
        .auth(login, password)
        .send({
          ...correctPostData,
          blogId: "-100",
        })
        .expect(400, {
          errorsMessages: [{ message: "Incorrect value", field: "blogId" }],
        });
      //get posts
      await request(app).get(routerName).expect(200);
    });

    it("201 and created post with correct data", async () => {
      //create post
      const res = await request(app)
        .post(routerName)
        .auth(login, password)
        .send({
          ...correctPostData,
          blogId: testBlogId1,
        })
        .expect(201);
      testPost1 = res.body;
      //get post
      await request(app)
        .get(routerName + "/" + testPost1.id)
        .expect(testPost1);
    });

    it("201 and created post with correct data2", async () => {
      //create post
      const res = await request(app)
        .post(routerName)
        .auth(login, password)
        .send({
          ...correctPostData,
          blogId: testBlogId2,
        })
        .expect(201);
      testPost2 = res.body;
      //get post
      await request(app)
        .get(routerName + "/" + testPost2.id)
        .expect(testPost2);
    });

    it("400 and not updated post with incorrect title and content", async () => {
      //update post
      await request(app)
        .put(routerName + "/" + testPost1.postId)
        .auth(login, password)
        .send({ ...incorrectPostData, blogId: testBlogId1 })
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "title" },
            { message: "Incorrect value", field: "content" },
          ],
        });
      //get post
      await request(app).get(routerName + "/" + testPost1.id);
      expect(testPost1);
    });

    it("400 and not updated post with overlength title and shortdescription", async () => {
      //update post
      await request(app)
        .put(routerName + "/" + testPost1.id)
        .auth(login, password)
        .send({
          ...overLengthPostData,
          blogId: testBlogId1,
        })
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "title" },
            { message: "Incorrect value", field: "shortDescription" },
          ],
        });
      //get posts
      await request(app).get(routerName).expect(200);
    });

    it("401 and not updated post with incorrect authorization", async () => {
      //update post
      await request(app)
        .put(routerName + "/" + testPost1.id)
        .auth("badlogin", "badpassword")
        .send({
          ...correctPostData,
          blogId: testBlogId1,
        })
        .expect(401);
      //get post
      await request(app).get(routerName + "/" + testPost1.id);
      expect(testPost1);
    });

    it("204 and updated post", async () => {
      //update post
      await request(app)
        .put(routerName + "/" + testPost1.id)
        .auth(login, password)
        .send({ ...correctUpdatePostData, blogId: testBlogId1 })
        .expect(204);
      //get post
      const res = await request(app).get(routerName + "/" + testPost1.id);
      expect(res.body).toEqual(
        (testPost1 = {
          ...testPost1,
          ...correctUpdatePostData,
          blogId: testBlogId1,
        })
      );
    });

    it("404 and not updated post with incorrect id", async () => {
      //update post
      await request(app)
        .put(routerName + "/" + new ObjectId().toString())
        .auth(login, password)
        .send({ ...correctUpdatePostData, blogId: testBlogId1 })
        .expect(404);
    });

    it("404 and not founded all comments with incorrect post id  ", async () => {
      //get comments for a post
      await request(app)
        .get(routerName + "/" + "112113" + "/" + "comments")
        .expect(404);
    });

    it("201 and created comment for post with correct data", async () => {
      //create comment
      await request(app)
        .post(routerName + "/" + testPost1.id + "/" + "comments")
        .set("Authorization", "Bearer " + testAuth.accessToken)
        .send(correctCommentData)
        .expect(201);
      //get all comments for a post
      await request(app)
        .get(routerName + "/" + testPost1.id + "/comments")
        .expect(200);
    });

    it("200 and founded all comments with correct post id", async () => {
      //get all comments for a post
      await request(app)
        .get(routerName + "/" + testPost1.id + "/" + "comments")
        .expect(200);
    });

    it("400 not and created comment for a user with incorrect data", async () => {
      //create comment
      await request(app)
        .post(routerName + "/" + testPost1.id + "/" + "comments")
        .set("Authorization", "Bearer " + testAuth.accessToken)
        .send(incorrectCommentData)
        .expect(400, {
          errorsMessages: [{ message: "Incorrect value", field: "content" }],
        });
      //get all comments for a post
      await request(app)
        .get(routerName + "/" + testPost1.id + "/comments")
        .expect(200);
    });

    it("401 and not created comment for a user with unauthorized user", async () => {
      //create comment
      await request(app)
        .post(routerName + "/" + testPost1.id + "/" + "comments")
        .set("Authorization", "Bearer " + "esae241dtg5")
        .send(correctCommentData)
        .expect(401);
      //get all comments for a post
      await request(app)
        .get(routerName + "/" + testPost1.id + "/comments")
        .expect(200);
    });

    it("404 and not created comment for a user with not founded post id", async () => {
      //create comment
      await request(app)
        .post(routerName + "/" + new ObjectId().toString() + "/" + "comments")
        .set("Authorization", "Bearer " + testAuth.accessToken)
        .send(correctCommentData)
        .expect(404);
      //get all comments for a post
      await request(app)
        .get(routerName + "/" + testPost1.id + "/comments")
        .expect(200);
    });

    it("200 and get posts array with 4 posts", async () => {
      //get posts
      const res = await request(app).get(routerName).expect(200);
      expect(res.body.items.length).toBe(2);
    });

    it("404 and not found post with incorrect id", async () => {
      //get post
      await request(app)
        .get(routerName + "/" + new ObjectId().toString())
        .expect(404);
    });

    it("200 and founded post with correct id", async () => {
      //get post
      await request(app)
        .get(routerName + "/" + testPost1.id)
        .expect(200, testPost1);
    });

    it("404 and not deleted post with incorrect id", async () => {
      //delete post
      await request(app)
        .delete(routerName + "/" + new ObjectId().toString())
        .auth(login, password)
        .expect(404);
    });

    it("401 and not deleted post with incorrect authorization", async () => {
      //delete post
      await request(app)
        .delete(routerName + "/" + testPost1.id)
        .auth("badlogin", "badpassword")
        .expect(401);
    });

    it("204 and deleted post with correct id and array with 1 post", async () => {
      //get posts
      const result = await request(app).get(routerName);
      const startPostsArrayLength = result.body.items.length;
      //delete post
      await request(app)
        .delete(routerName + "/" + testPost1.id)
        .auth(login, password)
        .expect(204);
      //get posts
      const res = await request(app).get(routerName).expect(200);
      expect(res.body.items.length).toBe(startPostsArrayLength - 1);
    });

    it("204 and deleted post with correct id and array with 0 post", async () => {
      //get posts
      const result = await request(app).get(routerName);
      const startPostsArrayLength = result.body.items.length;
      //delete post
      await request(app)
        .delete(routerName + "/" + testPost2.id)
        .auth(login, password)
        .expect(204);
      //get posts
      const res = await request(app).get(routerName).expect(200);
      expect(res.body.items.length).toBe(startPostsArrayLength - 1);
    });
  });
});
