import request from "supertest";
import { app } from "../../src/settings";
import { ObjectId } from "mongodb";

const blogRouterName = "/blogs";
const routerName = "/posts";
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

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("200 and empy array of posts", async () => {
    await request(app).get(routerName).expect(200);
  });

  let testBlogId1: string;
  let testBlogId2: string;

  it("Create blog1 for test posts", async () => {
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

  it("Create blog2 for test posts2", async () => {
    const res = await request(app)
      .post("/blogs/")
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
    await request(app).get(routerName).expect(200);
  });

  it("400 and not created post with overlength title and shortdescription", async () => {
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
    await request(app).get(routerName).expect(200);
  });

  it("401 and not created post with incorrect authorization", async () => {
    await request(app)
      .post(routerName)
      .auth("badlogin", "badpassword")
      .send({
        ...correctPostData,
        blogId: testBlogId1,
      })
      .expect(401);
    await request(app).get(routerName).expect(200);
  });

  it("400 and not created post with incorrect blog id", async () => {
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
    await request(app).get(routerName).expect(200);
  });

  let testPost1: any;

  it("201 and created post with correct data", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send({
        ...correctPostData,
        blogId: testBlogId1,
      })
      .expect(201);
    testPost1 = res.body;
    await request(app)
      .get(routerName + "/" + testPost1.id)
      .expect(testPost1);
  });

  let testPost2: any;

  it("201 and created post with correct data2", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send({
        ...correctPostData,
        blogId: testBlogId2,
      })
      .expect(201);
    testPost2 = res.body;
    await request(app)
      .get(routerName + "/" + testPost2.id)
      .expect(testPost2);
  });

  it("400 and not updated post with incorrect title and content", async () => {
    await request(app)
      .put(routerName + "/" + testPost1.id)
      .auth(login, password)
      .send({ ...incorrectPostData, blogId: testBlogId1 })
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "title" },
          { message: "Incorrect value", field: "content" },
        ],
      });
    await request(app).get(routerName + "/" + testPost1.id);
    expect(testPost1);
  });

  it("400 and not updated post with overlength title and shortdescription", async () => {
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
    await request(app).get(routerName).expect(200);
  });

  it("401 and not updated post with incorrect authorization", async () => {
    await request(app)
      .put(routerName + "/" + testPost1.id)
      .auth("badlogin", "badpassword")
      .send({
        ...correctPostData,
        blogId: testBlogId1,
      })
      .expect(401);
    await request(app).get(routerName + "/" + testPost1.id);
    expect(testPost1);
  });

  it("204 and updated post", async () => {
    await request(app)
      .put(routerName + "/" + testPost1.id)
      .auth(login, password)
      .send({ ...correctPostData, blogId: testBlogId1 })
      .expect(204);
    const res = await request(app).get(routerName + "/" + testPost1.id);
    expect(res.body).toEqual(
      (testPost1 = {
        ...testPost1,
        ...correctPostData,
        blogId: testBlogId1,
      })
    );
  });

  it("404 and not updated post with incorrect id", async () => {
    await request(app)
      .put(routerName + "/" + new ObjectId())
      .auth(login, password)
      .send({ ...correctPostData, blogId: testBlogId1 })
      .expect(404);
  });

  it("200 and get posts array with 2 posts", async () => {
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.items.length).toBe(2);
  });

  it("404 and not found post with incorrect id", async () => {
    await request(app)
      .get(routerName + "/" + new ObjectId())
      .expect(404);
  });

  it("200 and founded post with correct id", async () => {
    await request(app)
      .get(routerName + "/" + testPost1.id)
      .expect(200, testPost1);
  });

  it("404 and not deleted post with incorrect id", async () => {
    await request(app)
      .delete(routerName + "/" + new ObjectId())
      .auth(login, password)
      .expect(404);
  });

  it("401 and not deleted post with incorrect authorization", async () => {
    await request(app)
      .delete(routerName + "/" + testPost1.id)
      .auth("badlogin", "badpassword")
      .expect(401);
  });

  it("204 and deleted post with correct id and array with 1 post", async () => {
    const result = await request(app).get(routerName);
    const startPostsArrayLength = result.body.items.length;
    await request(app)
      .delete(routerName + "/" + testPost1.id)
      .auth(login, password)
      .expect(204);
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.items.length).toBe(startPostsArrayLength - 1);
  });

  it("204 and deleted post with correct id and array with 0 post", async () => {
    const result = await request(app).get(routerName);
    const startPostsArrayLength = result.body.items.length;
    await request(app)
      .delete(routerName + "/" + testPost2.id)
      .auth(login, password)
      .expect(204);
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.items.length).toBe(startPostsArrayLength - 1);
  });
});
