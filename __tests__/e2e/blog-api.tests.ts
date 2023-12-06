import request from "supertest";
import { app } from "./../../src/settings";

const routerName = "/blogs";
const login = "admin";
const password = "qwerty";

const correctData = {
  name: "Blog",
  description: "Description Blog",
  websiteUrl: "http://www.blog.com",
};
const emptyData = {
  name: "",
  description: "",
  websiteUrl: "",
};

const overLengthData = {
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
  websiteUrl:
    "http://www.tochkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com",
};
describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("200 and empty array", async () => {
    await request(app).get(routerName).expect(200, []);
  });

  it("400 and not created post with incorrect data(empty fields)", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send({
        name: "",
        description: "",
        websiteUrl: "",
      })
      .expect(400, {
        errorMessages: [
          { message: "Invalid value", field: "name" },
          { message: "Invalid value", field: "description" },
          { message: "Invalid value", field: "websiteUrl" },
        ],
      });
    await request(app).get(routerName).expect(200);
  });

  it("400 and not created post with incorrect data(over lenght)"),
    async () => {
      await request(app)
        .post(routerName)
        .auth(login, password)
        .send(overLengthData)
        .expect(400, {
          errorMessages: [
            { message: "Invalid value", field: "name" },
            { message: "Invalid value", field: "description" },
          ],
        });
      await request(app).get(routerName).expect(200);
    };

  it("401 and not created blog with invalid authorization"),
    async () => {
      await request(app)
        .post(routerName)
        .auth("notadmin", "notpassword")
        .send(correctData)
        .expect(401);
      await request(app).get(routerName).expect(200);
    };

  let testBlog1: any;

  it("201 and created blog with correct data(testBlog1)"),
    async () => {
      const res = await request(app)
        .post(routerName)
        .auth(login, password)
        .send(correctData)
        .expect(201);
      testBlog1 = res.body;
      await request(app)
        .get(routerName + testBlog1.id)
        .expect(testBlog1);
    };

  let testBlog2: any;

  it("201 and created blog with correct data(testBlog2)"),
    async () => {
      const res = await request(app)
        .post(routerName)
        .auth(login, password)
        .send(correctData)
        .expect(201);
      testBlog1 = res.body;
      await request(app)
        .get(routerName + testBlog2.id)
        .expect(testBlog2);
    };

  it("400 and not updated blog with incorrect data", async () => {
    await request(app)
      .put(routerName + testBlog1.id)
      .auth(login, password)
      .send(emptyData)
      .expect(400, {
        errorMessages: [
          { message: "Invalid value", field: "name" },
          { message: "Invalid value", field: "websiteUrl" },
        ],
      });
    await request(app)
      .get(routerName + testBlog1.id)
      .expect(testBlog1);
  });

  it("400 and not updated post with incorrect data(over lenght)"),
    async () => {
      await request(app)
        .put(routerName + testBlog1.id)
        .auth(login, password)
        .send(overLengthData)
        .expect(400, {
          errorMessages: [
            { message: "Invalid value", field: "name" },
            { message: "Invalid value", field: "description" },
          ],
        });
      await request(app).get(routerName).expect(200);
    };

  it("401 and not updated blog with invalid authorization", async () => {
    const updatedData = {
      name: "Blog123",
      description: "blogblogblogblogblogblogblog",
      websiteUrl: "http//www.test111.com",
    };
    await request(app)
      .put(routerName + testBlog1.id)
      .auth("badlogin", "badpassword")
      .send(updatedData)
      .expect(401);
    await request(app)
      .get(routerName + testBlog1.id)
      .expect(testBlog1);
  });

  it("204 and updated blog", async () => {
    const updatedData = {
      name: "Blog123",
      description: "blogblogblogblogblogblogblog",
      websiteUrl: "http//www.test111.com",
    };
    await request(app)
      .put(routerName + testBlog1.id)
      .auth(login, password)
      .send(updatedData)
      .expect(204);
    const res = await request(app)
      .get(routerName + testBlog1.id)
      .expect(200);
    expect(res.body).toEqual(
      (testBlog1 = {
        ...testBlog1,
        ...updatedData,
      })
    );
  });

  it("404 and not updated blog with incorrect id", async () => {
    await request(app)
      .put(routerName + "-100")
      .auth(login, password)
      .expect(404);
  });

  it("200 and blog", async () => {
    await request(app)
      .put(routerName + testBlog1.id)
      .auth(login, password)
      .expect(200);
  });

  it("404 and not deleted blog with incorrect id", async () => {
    await request(app)
      .delete(routerName + "-100")
      .auth(login, password)
      .expect(404);
  });

  it("401 and not deleted blog with incorrect authorization", async () => {
    await request(app)
      .delete(routerName + testBlog2.id)
      .auth("badlogin", "badpassword")
      .expect(401);
  });

  it("204 and deleted blog with correct id and array with 1 blog", async () => {
    const result = await request(app).get(routerName);
    const startBlogsArrayLength = result.body.lenght;

    await request(app)
      .delete(routerName + testBlog2.id)
      .auth(login, password)
      .expect(204);
    const res = await request(app).get(routerName).expect(200);
    expect(res.body.lenght).toBe(startBlogsArrayLength - 1);
  });
});
