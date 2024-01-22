import request from "supertest";
import { app } from "./../../src/settings";
import { ObjectId } from "mongodb";

const routerName = "/blogs";
const login = "admin";
const password = "qwerty";

const correctBlogData = {
  name: "Blog",
  description: "Description Blog",
  websiteUrl: "https://www.blog.com",
};

const correctUpdateBlogData = {
  name: "Update Blog",
  description: "Update Description Blog",
  websiteUrl: "https://www.updateblog.com",
};

const incorrectBlogData = {
  name: "Blogblogblogloglboglboglboglbog",
  description: "",
  websiteUrl: "https://www.blog.com",
};

const emptyBlogData = {
  name: "",
  description: "",
  websiteUrl: "",
};

const overLengthBlogData = {
  name: "name is too much ola-la",
  description: `"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"`,
  websiteUrl: "https://www.blog.com",
};

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  let testBlog1: any;
  let testBlog2: any;

  it("200 and empty array of blogs", async () => {
    await request(app).get(routerName).expect(200);
  });
  it("400 and not created post with empty data", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send(emptyBlogData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "name" },
          { message: "Incorrect value", field: "description" },
          { message: "Incorrect value", field: "websiteUrl" },
        ],
      });
    await request(app).get(routerName).expect(200);
  });
  it("400 and not created post with overlength name and description", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send(overLengthBlogData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "name" },
          { message: "Incorrect value", field: "description" },
        ],
      });
    await request(app).get(routerName).expect(200);
  });
  it("401 and not created blog with incorrect authorization", async () => {
    await request(app)
      .post(routerName)
      .auth("badadmin", "badpassword")
      .send(correctBlogData)
      .expect(401);
    await request(app).get(routerName).expect(200);
  });
  it("201 and created blog with correct data1", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send(correctBlogData)
      .expect(201);
    testBlog1 = res.body;
    await request(app).get(routerName + "/" + testBlog1.id);
    expect(testBlog1);
  });
  it("201 and created blog with correct data2", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send(correctBlogData)
      .expect(201);
    testBlog2 = res.body;
    await request(app).get(routerName + "/" + testBlog2.id);
    expect(testBlog2);
  });
  it("400 and not updated blog with incorrect name and description", async () => {
    await request(app)
      .put(routerName + "/" + testBlog1.id)
      .auth(login, password)
      .send(incorrectBlogData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "name" },
          { message: "Incorrect value", field: "description" },
        ],
      });
    await request(app).get(routerName + "/" + testBlog1.id);
    expect(testBlog1);
  });
  it("400 and not updated post with overlength name and description)", async () => {
    await request(app)
      .put(routerName + "/" + testBlog1.id)
      .auth(login, password)
      .send(overLengthBlogData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "name" },
          { message: "Incorrect value", field: "description" },
        ],
      });
    await request(app).get(routerName + "/" + testBlog1.id);
    expect(testBlog1);
  });
  it("401 and not updated blog with incorrect authorization", async () => {
    await request(app)
      .put(routerName + "/" + testBlog1.id)
      .auth("badlogin", "badpassword")
      .send(correctUpdateBlogData)
      .expect(401);
    await request(app).get(routerName + "/" + testBlog1.id);
    expect(testBlog1);
  });
  it("204 and updated blog", async () => {
    await request(app)
      .put(routerName + "/" + testBlog1.id)
      .auth(login, password)
      .send(correctUpdateBlogData)
      .expect(204);
    const res = await request(app)
      .get(routerName + "/" + testBlog1.id)
      .expect(200);
    expect(res.body).toEqual(
      (testBlog1 = {
        ...testBlog1,
        ...correctUpdateBlogData,
      })
    );
  });
  it("404 and not updated blog with incorrect id", async () => {
    await request(app)
      .put(routerName + new ObjectId())
      .auth(login, password)
      .send(correctUpdateBlogData)
      .expect(404);
  });
  it("404 and not deleted blog with incorrect id", async () => {
    await request(app)
      .delete(routerName + "/" + new ObjectId())
      .auth(login, password)
      .expect(404);
  });
  it("401 and not deleted blog with incorrect authorization", async () => {
    await request(app)
      .delete(routerName + "/" + testBlog2.id)
      .auth("badlogin", "badpassword")
      .expect(401);
  });
  it("204 and deleted blog with correct id and array with 1 blog", async () => {
    const result = await request(app).get(routerName);
    const startBlogsArrayLength = result.body.items.length;
    await request(app)
      .delete(routerName + "/" + testBlog1.id)
      .auth(login, password)
      .expect(204);
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.items.length).toBe(startBlogsArrayLength - 1);
  });
  it("204 and deleted blog with correct id and array with 0 blog", async () => {
    const result = await request(app).get(routerName);
    const startBlogsArrayLength = result.body.items.length;
    await request(app)
      .delete(routerName + "/" + testBlog2.id)
      .auth(login, password)
      .expect(204);
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.items.length).toBe(startBlogsArrayLength - 1);
  });
});
