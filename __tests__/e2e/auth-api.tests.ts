import request from "supertest";
import { app } from "./../../src/settings";
import { ObjectId } from "mongodb";

const routerName = "/auth";
const userRouterName = "/users";

const login = "admin";
const password = "qwerty";

const correctAuthData = {
  loginOrEmail: "login123",
  password: "password123",
  id: "",
};

const incorrectAuthData = {
  loginOrEmail: "l",
  password: "z",
};

const emptyAuthData = {
  loginOrEmail: "",
  password: "",
};

const overLengthAuthData = {
  loginOrEmail: "login123",
  password: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
};

const correctUserData = {
  login: "good",
  password: "goodpassword",
  email: "goodmail@mail.ru",
};

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("400 and not logged user with empty auth data", async () => {
    await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    await request(app)
      .post(routerName + "/" + "login")
      .send(emptyAuthData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "loginOrEmail" },
          { message: "Incorrect value", field: "password" },
        ],
      });
  });
  it("400 and not logged user with incorrect auth data", async () => {
    await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    await request(app)
      .post(routerName + "/" + "login")
      .send(incorrectAuthData)
      .expect(400, {
        errorsMessages: [
          { message: "Incorrect value", field: "loginOrEmail" },
          { message: "Incorrect value", field: "password" },
        ],
      });
  });
  it("400 and not logged user with overlength auth password", async () => {
    await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    await request(app)
      .post(routerName + "/" + "login")
      .send(overLengthAuthData)
      .expect(400, {
        errorsMessages: [{ message: "Incorrect value", field: "password" }],
      });
  });
  it("401 and not logged user with incorrect user authorization", async () => {
    await request(app)
      .post(userRouterName)
      .auth("badlogin", "badpassword")
      .send(correctUserData)
      .expect(401);
    await request(app)
      .post(routerName + "/" + "login")
      .send(correctAuthData)
      .expect(401);
  });
  it("200 and logged user with correct data", async () => {
    const user = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    await request(app)
      .post(routerName + "/" + "login")
      .send({
        loginOrEmail: user.body.login,
        password: correctUserData.password,
      })
      .expect(200);
  });
  it("401 and got no information about current user with not logged user", async () => {
    let user = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    await request(app)
      .post(routerName + "/" + "login")
      .send({
        loginOrEmail: user.body.login,
        password: "badpassword",
      })
      .expect(401);
    await request(app)
      .get(routerName + "/" + "me")
      .send({
        login: user.body.login,
        password: correctUserData.password,
        userId: new ObjectId(),
      })
      .expect(401);
  });
  it("200 and got information about current user logged user", async () => {
    const user = await request(app)
      .post(userRouterName)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);

    const auth = await request(app)
      .post(routerName + "/" + "login")
      .send({
        loginOrEmail: user.body.login,
        password: correctUserData.password,
      })
      .expect(200);
    await request(app)
      .get(routerName + "/" + "me")
      .set("Authorization", "Bearer " + auth.body.accessToken)
      .expect(200);
  });
});
