import request from "supertest";
import { app } from "./../../src/settings";
import { ObjectId } from "mongodb";

const routerName = "/users";
const login = "admin";
const password = "qwerty";

const correctUserData = {
  login: "good",
  password: "goodpassword",
  email: "goodmail@mail.ru",
};
const emptyUserData = {
  login: "",
  password: "",
  email: "",
};
const incorrectUserData = {
  login: "l",
  password: "p",
  email: "e",
};
const overLengthUserData = {
  login: "aaaaaaaaaaaaaaaaaa",
  password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  email: "goodmail@mail.ru",
};

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });
  it("200 and empty array of users", async () => {
    await request(app).get(routerName).auth(login, password).expect(200);
  });

  it("400 and not created user with incorrect data", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send(incorrectUserData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "login" },
          { message: "Incorrect value", field: "password" },
          { message: "Incorrect value", field: "email" },
        ],
      });
    await request(app).get(routerName).auth(login, password).expect(200);
  });
  it("400 and not created user with empy data", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send(emptyUserData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "login" },
          { message: "Incorrect value", field: "password" },
          { message: "Incorrect value", field: "email" },
        ],
      });
    await request(app).get(routerName).auth(login, password).expect(200);
  });
  it("400 and not created user with overlength login and password", async () => {
    await request(app)
      .post(routerName)
      .auth(login, password)
      .send(overLengthUserData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "login" },
          { message: "Incorrect value", field: "password" },
        ],
      });
    await request(app).get(routerName).auth(login, password).expect(200);
  });

  it("401 and not created user with incorrect authorization", async () => {
    await request(app)
      .post(routerName)
      .auth("badlogin", "badpassword")
      .send(correctUserData)
      .expect(401);
    await request(app).get(routerName).auth(login, password).expect(200);
  });

  let testUser1: any;

  it("201 and created user with correct all data(only testUser1)", async () => {
    const res = await request(app)
      .post(routerName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    testUser1 = res.body;
    const result = await request(app)
      .get(routerName)
      .auth(login, password)
      .expect(200);
    expect(result.body.items[0]).toEqual({
      id: expect.any(String),
      login: "good",
      email: "goodmail@mail.ru",
      createdAt: expect.any(String),
    });
  });

  it("200 and correct all data (only testUser1)", async () => {
    const result = await request(app)
      .get(routerName)
      .auth(login, password)
      .expect(200);
    expect(result.body.items[0]).toEqual({
      id: expect.any(String),
      login: "good",
      email: "goodmail@mail.ru",
      createdAt: expect.any(String),
    });
  });

  it("404 and not deleted user with incorrect id and get all data(only testUser1)", async () => {
    const res = await request(app)
      .delete(routerName + "/" + new ObjectId())
      .auth(login, password)
      .expect(404);
    const result = await request(app)
      .get(routerName)
      .auth(login, password)
      .expect(200);
    expect(result.body.items[0]).toEqual({
      id: expect.any(String),
      login: "good",
      email: "goodmail@mail.ru",
      createdAt: expect.any(String),
    });
  });

  it("204 and deleted user with correct id and array with 0 users", async () => {
    const res = await request(app).get(routerName).auth(login, password);
    const startUsersArrayLength = res.body.items.length;
    await request(app)
      .delete(routerName + "/" + testUser1.id)
      .auth(login, password)
      .expect(204);

    const result = await request(app)
      .get(routerName)
      .auth(login, password)
      .expect(200);
    expect(result.body.items.length).toBe(startUsersArrayLength - 1);
  });
});
