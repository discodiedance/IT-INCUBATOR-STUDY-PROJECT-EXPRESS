import request from "supertest";
import { app } from "./../../src/settings";

const blogRouterName = "/blogs";
const routerName = "/posts";
const login = "admin";
const password = "qwerty";
const emptyData = {
  title: "",
  shortDescription: "",
  content: "",
  blogId: "",
};
const spaceData = {
  title: "            ",
  shortDescription: "            ",
  content: "            ",
  blogId: "            ",
};
const overLengthData = {
  title: "11111111111111111111111111111111111111111111111111111111111",
  shortDescription:
    "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
  content:
    "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
  blogId: "asdasdasdasdasdasdasdasd",
};
const validCreateData = {
  title: "titleTest",
  shortDescription: "shortDescriptionTest",
  content: "contentTest",
  blogId: "blogIdTest",
};
const validUpdateData = {
  title: "updateTitle",
  shortDescription: "updateShortDescription",
  content: "updateContent",
};

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });
  it("200 and empy array", async () => {
    await request(app).get(routerName).expect(200, []);
  });
  let testBlogID1: string;
  let testBlogID2: string;

  it("Create blog for test posts", async () => {
    const res = await request(app)
      .post("/blogs/")
      .auth(login, password)
      .send({
        name: "Blog 1 posts",
        description: "Description for blog",
        websiteURL: "http://www.testblog.com",
      })
      .expect(201);
    testBlogID1 = res.body.id;
  });
  it("Create blog for test posts2", async () => {
    const res = await request(app)
      .post("/blogs/")
      .auth(login, password)
      .send({
        name: "Blog 2 posts",
        description: "Description for blog",
        websiteURL: "http://www.testblog.com",
      })
      .expect(201);
    testBlogID2 = res.body.id;
  });
  it("400 and not created post with empty data", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send({
        ...emptyData,
        blogId: testBlogID1,
      })
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "shortDescription" },
          { message: "Invalid value", field: "content" },
        ],
      });
    await request(app).get(routerName).expect(200, []);
  });
  it("400 and not created post with incorrect data(over lenght)", async () => {
    await request(app)
      .get(routerName)
      .auth(login, password)
      .send({
        ...overLengthData,
        blogId: testBlogID1,
      })
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "shortDescription" },
          { message: "Invalid value", field: "content" },
        ],
      });
    await request(app).get(routerName).expect(200, []);
  });
  it("400 and not created post with incorrect data(only spaces)", async () => {
    await request(app)
      .get(routerName)
      .auth(login, password)
      .send({
        ...spaceData,
        blogId: testBlogID1,
      })
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "shortDescription" },
          { message: "Invalid value", field: "content" },
        ],
      });
    await request(app).get(routerName).expect(200, []);
  });
  it("400 and not created post with incorrect blog id", async () => {
    await request(app)
      .get(routerName)
      .auth(login, password)
      .send({
        ...validCreateData,
        blogId: "-100",
      })
      .expect(400, {
        errorsMessages: [{ message: "Invalid value", field: "blogId" }],
      });
    await request(app).get(routerName).expect(200, []);
  });
  it("401 and not created post with incorrect authorization", async () => {
    await request(app)
      .get(routerName)
      .auth("badlogin", "badpassword")
      .send({
        ...validCreateData,
        blogId: testBlogID1,
      })
      .expect(401);
    await request(app).get(routerName).expect(200, []);
  });
  let testPost1: any;
  it("201 and created post with correct data", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send({
        ...validCreateData,
        blogId: testBlogID1,
      })
      .expect(201);
    testPost1 = res.body;
    await request(app)
      .get(routerName + testPost1.id)
      .expect(testPost1);
  });
  let testPost2: any;
  it("201 and created post with correct data2", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send({
        ...validCreateData,
        blogId: testBlogID1,
      })
      .expect(201);
    testPost1 = res.body;
    await request(app)
      .get(routerName + testPost2.id)
      .expect(testPost2);
  });
  it("400 and not created post with incorrect data(empty)", async () => {
    await request(app)
      .post(routerName + testPost1.id)
      .auth(login, password)
      .send(emptyData)
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "shortDescription" },
          { message: "Invalid value", field: "content" },
          { message: "Invalid value", field: "blogId" },
        ],
      });
    await request(app)
      .get(routerName + testPost1.id)
      .expect(testPost1);
  });
  it("400 and not created post with incorrect data(overlenght)", async () => {
    await request(app)
      .post(routerName + testPost1.id)
      .auth(login, password)
      .send({ ...overLengthData, blogId: testBlogID1 })
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "shortDescription" },
          { message: "Invalid value", field: "content" },
        ],
      });
    await request(app)
      .get(routerName + testPost1.id)
      .expect(testPost1);
  });
  it("400 and not updated post with incorrect data(spaces)", async () => {
    await request(app)
      .post(routerName + testPost1.id)
      .auth(login, password)
      .send(spaceData)
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "shortDescription" },
          { message: "Invalid value", field: "content" },
        ],
      });
    await request(app)
      .get(routerName + testPost1.id)
      .expect(testPost1);
  });
  it("401 and not created post with invalid authorization", async () => {
    await request(app)
      .post(routerName + testPost1.id)
      .auth("badlogin", "badpassword")
      .send({ ...validUpdateData, blogId: testBlogID1 })
      .expect(401);
    await request(app)
      .get(routerName + testPost1.id)
      .expect(testPost1);
  });
  it("204 and updated post with valid data", async () => {
    await request(app)
      .post(routerName + testPost1.id)
      .auth(login, password)
      .send({ ...validUpdateData, blogId: testBlogID1 })
      .expect(204);
    const res = await request(app)
      .get(routerName + testPost1.id)
      .expect(testPost1);
    expect(res.body).toEqual(
      (testPost1 = {
        ...testPost1,
        ...validUpdateData,
      })
    );
  });

  it("204 and updated post with new blog id", async () => {
    await request(app)
      .post(routerName + testPost2.id)
      .auth(login, password)
      .send({ ...testPost2, blogId: testBlogID2 })
      .expect(204);
    const res = await request(app)
      .get(routerName + testPost2.id)
      .expect(200);
    expect(res.body).toEqual(
      (testPost2 = {
        ...testPost2,
        blogName: res.body.blogName,
        blogId: testBlogID2,
      })
    );
    expect(res.body.blogId === testBlogID2);
  });
  it("200 and get all posts (array with lenght = 2)", async () => {
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.lenght.toBe(2));
  });
  it("404 and not found post with invalid ID", async () => {
    await request(app)
      .get(routerName + "-100")
      .expect(404);
  });
  it("200 and founded post with correct id", async () => {
    await request(app)
      .get(routerName + testPost1)
      .expect(200, testPost1);
  });
  it("404 and not deleted post with invalid id", async () => {
    await request(app)
      .delete(routerName + "-100")
      .auth(login, password)
      .expect(404);
  });
  it("401 and not deleted post with invalid authorization", async () => {
    await request(app)
      .delete(routerName + testPost1.id)
      .auth("badlogin", "badpassword")
      .expect(401);
  });
  it("204 and deleted post with array lenght = 1", async () => {
    await request(app)
      .delete(routerName + testPost2.id)
      .auth(login, password)
      .expect(204);
    const res = await request(app).get(routerName).expect(204);
    expect(res.body.lenght).toBe(1);
  });
  it("BlogId", async () => {
    await request(app)
      .post(blogRouterName + "/123/posts")
      .auth(login, password)
      .send({
        content: "new post content",
        shortDescription: "description",
        title: "post title",
      })
      .expect(404);
  });
});
