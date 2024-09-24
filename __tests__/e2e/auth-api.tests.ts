import request from "supertest";
import { app } from "./../../src/settings";
import mongoose from "mongoose";
import { UserModel } from "../../src/features/domain/entities/user-entity";

const routerName = "/auth";
const userRouterName = "/users";

const login = "admin";
const password = "qwerty";

const correctLoginUserData = {
  loginOrEmail: "good123",
  password: "goodpassword",
};

const correctLoginUserData2 = {
  loginOrEmail: "good1234",
  password: "goodpassword2",
};

const correctRegistrationData = {
  login: "disco",
  password: "1234567",
  email: "fundu1448@gmail.com",
};

const incorrectRegistrationLoginData = {
  login: "hs",
  password: "1234567",
  email: "ulyalya@gmail.com",
};

const incorrectRegistrationPasswordData = {
  login: "disco123",
  password: "1",
  email: "ulyalya@gmail.com",
};

const incorrectRegistrationEmailData = {
  login: "disco1234",
  password: "1234567",
  email: "1",
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
  login: "good123",
  password: "goodpassword",
  email: "goodmail@mail.ru",
};
const correctUserData2 = {
  login: "good1234",
  password: "goodpassword2",
  email: "goodmail2@mail.ru",
};

let user1: any;
let user2: any;

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

    it("201 and create user1", async () => {
      //create user1
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send(correctUserData)
        .expect(201);
      user1 = res.body;
    });

    it("201 and create user2", async () => {
      //create user2
      const res = await request(app)
        .post(userRouterName)
        .auth(login, password)
        .send(correctUserData2)
        .expect(201);
      user2 = res.body;
    });

    it("400 and not registated user with incorrect input login data", async () => {
      //registration
      await request(app)
        .post(routerName + "/registration")
        .send(incorrectRegistrationLoginData)
        .expect(400, {
          errorsMessages: [{ message: "Incorrect value", field: "login" }],
        });
    });

    it("400 and not registated user with incorrect input password data", async () => {
      //registration
      await request(app)
        .post(routerName + "/registration")
        .send(incorrectRegistrationPasswordData)
        .expect(400, {
          errorsMessages: [{ message: "Incorrect value", field: "password" }],
        });
    });

    it("400 and not registated user with incorrect input email data", async () => {
      //registration
      await request(app)
        .post(routerName + "/registration")
        .send(incorrectRegistrationEmailData)
        .expect(400, {
          errorsMessages: [{ message: "Incorrect value", field: "email" }],
        });
    });

    it("400 and not registated user with already existing login", async () => {
      //registration
      await request(app)
        .post(routerName + "/registration")
        .send({
          login: correctUserData.login,
          password: "goodpassword",
          email: "goodmail00@mail.ru",
        })
        .expect(400, {
          errorsMessages: [{ message: "Already exists", field: "login" }],
        });
    });

    it("400 and not registated user with already existing email", async () => {
      //registration
      await request(app)
        .post(routerName + "/registration")
        .send({
          login: "good123000",
          password: "goodpassword",
          email: correctUserData.email,
        })
        .expect(400, {
          errorsMessages: [{ message: "Already exists", field: "email" }],
        });
    });

    it("429 and not registered user with too many requests", async () => {
      //registration
      await request(app)
        .post(routerName + "/registration")
        .send({ correctRegistrationData })
        .expect(429);
    });

    it("400 and not logged user with empty auth data", async () => {
      //login user1
      await request(app)
        .post(routerName + "/login")
        .set("user-agent", "user1FirstDevice")
        .send(emptyAuthData)
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "loginOrEmail" },
            { message: "Incorrect value", field: "password" },
          ],
        });
    });

    it("400 and not logged user with incorrect auth data", async () => {
      //login user1
      await request(app)
        .post(routerName + "/login")
        .set("user-agent", "user1FirstDevice")
        .send(incorrectAuthData)
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "loginOrEmail" },
            { message: "Incorrect value", field: "password" },
          ],
        });
    });

    it("400 and not logged user with overlength auth password", async () => {
      //login user1
      await request(app)
        .post(routerName + "/login")
        .set("user-agent", "user1FirstDevice")
        .send(overLengthAuthData)
        .expect(400, {
          errorsMessages: [{ message: "Incorrect value", field: "password" }],
        });
    });

    it("401 and not logined user with wrong password", async () => {
      //login user1
      await request(app)
        .post(routerName + "/login")
        .set("user-agent", "deviceForWrongPassword")
        .send({ loginOrEmail: user1.login, password: "badpassword" })
        .expect(401);
    });

    it("401 and not updated refresh and access tokens", async () => {
      //login
      const device = await request(app)
        .post(routerName + "/login")
        .set("user-agent", "deviceForUpdate")
        .send(correctLoginUserData)
        .expect(200);
      expect(device.body).toEqual({
        accessToken: expect.any(String),
      });
      //refresh tokens
      await request(app)
        .post(routerName + "/refresh-token")
        .set("Cookie", "badRefreshToken")
        .expect(401);
    });

    it("200 and updated refresh and access tokens", async () => {
      //login
      const device = await request(app)
        .post(routerName + "/login")
        .set("user-agent", "deviceForUpdate")
        .send(correctLoginUserData)
        .expect(200);
      expect(device.body).toEqual({
        accessToken: expect.any(String),
      });
      const refreshToken = device.headers["set-cookie"];
      //refresh tokens
      await request(app)
        .post(routerName + "/refresh-token")
        .set("Cookie", refreshToken)
        .expect(200);
    });

    it("429 and get all devices, login user 6 times with the same ip and user-agent ", async () => {
      for (let i = 0; i < 5; i++) {
        //login user 5 times
        await request(app)
          .post(routerName + "/login")
          .set("user-agent", "firstDevice1")
          .set("X-Forwarded-For", "123")
          .send(correctLoginUserData2)
          .expect(200);
      }
      //login 6th time
      await request(app)
        .post(routerName + "/login")
        .set("user-agent", "firstDevice1")
        .set("X-Forwarded-For", "123")
        .send(correctLoginUserData2)
        .expect(429);
    });

    it("200 and logined user1 with correct data", async () => {
      //login
      await request(app)
        .post(routerName + "/" + "login")
        .set("user-agent", "user1FirstDevice")
        .send({
          loginOrEmail: user1.login,
          password: correctUserData.password,
        })
        .expect(200);
    });

    it("401 and got no information about current user with not logined user", async () => {
      // login
      const res = await request(app)
        .post(routerName + "/" + "login")
        .send({
          loginOrEmail: user2.login,
          password: "badpassword",
        })
        .expect(401);
      await request(app)
        //check profile of the user
        .get(routerName + "/" + "me")
        .set("Authorization", "Bearer " + res.body.accessToken)
        .expect(401);
    });

    it("200 and got information about current user logined user", async () => {
      //login
      const auth = await request(app)
        .post(routerName + "/" + "login")
        .send({
          loginOrEmail: user1.login,
          password: correctUserData.password,
        })
        .expect(200);
      //check profile of the user
      await request(app)
        .get(routerName + "/" + "me")
        .set("Authorization", "Bearer " + auth.body.accessToken)
        .expect(200);
    });

    it("401 and not logouted user with bad refresh token", async () => {
      //login
      const device = await request(app)
        .post(routerName + "/login")
        .set("X-Forwarded-For", "1234")
        .set("user-agent", "deviceForLogout")
        .send(correctLoginUserData2)
        .expect(200);
      expect(device.body).toEqual({
        accessToken: expect.any(String),
      });
      const refreshToken = device.headers["set-cookie"];
      //logout
      await request(app)
        .post(routerName + "/logout")
        .set("Cookie", "badRefreshToken")
        .expect(401);
      //get all devices
      await request(app)
        .get("/security/devices")
        .set("Cookie", refreshToken)
        .expect(200);
    });
  });

  it("204 and registated user with correct input data", async () => {
    //registration
    await request(app)
      .post(routerName + "/registration")
      .send(correctRegistrationData)
      .expect(204);
    //get users
    const users = await request(app).get(userRouterName).auth(login, password);
    expect(200);
    expect(users.body.items[2]).toEqual({
      id: expect.any(String),
      login: "disco",
      email: "fundu1448@gmail.com",
      createdAt: expect.any(String),
    });
  });

  it("400 and not sent mail with confrimation code to the inccorect email", async () => {
    //email resending
    await request(app)
      .post(routerName + "/registration-email-resending")
      .send({ email: "0" })
      .expect(400);
  });

  it("204 and sent confirmation code to the mail of the user with valid email", async () => {
    //email resending
    await request(app)
      .post(routerName + "/registration-email-resending")
      .send({ email: "fundu1448@gmail.com" })
      .expect(204);
  });

  it("429 and not sent mail with confrimation code cuz of too many requests", async () => {
    //email resending 4 times
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post(routerName + "/registration-email-resending")
        .send({ email: "fundu1448@gmail.com" })
        .expect(204);
    }
    //email resending 6th time
    await request(app)
      .post(routerName + "/registration-email-resending")
      .send({ email: "fundu1448@gmail.com" })
      .expect(429);
  });

  it("400 and not verified email with incorrect confirmation code", async () => {
    //registration confirmation
    await request(app)
      .post(routerName + "/registration-confirmation")
      .send({ code: "cheburek" })
      .expect(400);
  });

  it("204 and verified email with correct confirmation code", async () => {
    const user = await UserModel.findOne({
      "accountData.email": "fundu1448@gmail.com",
    });
    //registration confirmation
    await request(app)
      .post(routerName + "/registration-confirmation")
      .send({ code: user!.emailConfirmation.confirmationCode })
      .expect(204);
  });

  it("429 and not verified email cuz of too many requests", async () => {
    //registration confirmation 3 times
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post(routerName + "/registration-confirmation")
        .send({ code: "cheburek" })
        .expect(400);
    }
    //registration confirmation 6th time
    await request(app)
      .post(routerName + "/registration-confirmation")
      .send({ code: "cheburek" })
      .expect(429);
  });

  it("204 and sent recovery password code to the existing email in DB", async () => {
    //password recovery
    await request(app)
      .post(routerName + "/password-recovery")
      .send({ email: "fundu1448@gmail.com" })
      .expect(204);
  });

  it("204 and not sent recovery password code to the non-existing email in DB", async () => {
    //password recovery
    await request(app)
      .post(routerName + "/password-recovery")
      .send({ email: "0nfdsakl2@gmail.com" })
      .expect(204);
  });

  it("400 and not sent recovery password code cuz of invalid email", async () => {
    //password recovery
    await request(app)
      .post(routerName + "/password-recovery")
      .send({ email: "1" })
      .expect(400);
  });

  it("429 and not sent recovery password code cuz of too many requests", async () => {
    for (let i = 0; i < 2; i++) {
      //password recovery 2 times
      await request(app)
        .post(routerName + "/password-recovery")
        .send({ email: "1" })
        .expect(400);
    }
    //password recovery 6th time
    await request(app)
      .post(routerName + "/password-recovery")
      .send({ email: "1" })
      .expect(429);
  });

  it("204 and updated password with correct input data", async () => {
    const user = await UserModel.findOne({
      "accountData.email": "fundu1448@gmail.com",
    });
    //update new password
    await request(app)
      .post(routerName + "/new-password")
      .send({
        newPassword: "12345678",
        recoveryCode: user!.passwordRecoveryConfirmation.recoveryCode,
      })
      .expect(204);
    //login user with updated password
    await request(app)
      .post(routerName + "/login")
      .set("X-Forwarded-For", "1.11.111")
      .send({ loginOrEmail: "fundu1448@gmail.com", password: "12345678" })
      .expect(200);
  });

  it("401 and not logined with old password user", async () => {
    //login user with old password
    await request(app)
      .post(routerName + "/login")
      .set("X-Forwarded-For", "1.11.1111")
      .send({ loginOrEmail: "fundu1448@gmail.com", password: "1234567" })
      .expect(401);
  });

  it("400 and not updated password cuz of incorrect password", async () => {
    const user = await UserModel.findOne({
      "accountData.email": "fundu1448@gmail.com",
    });
    //update new password
    await request(app)
      .post(routerName + "/new-password")
      .send({
        newPassword: "1",
        recoveryCode: user!.passwordRecoveryConfirmation.recoveryCode,
      })
      .expect(400, {
        errorsMessages: [{ message: "Incorrect value", field: "newPassword" }],
      });
  });

  it("400 and not updated password cuz of incorrect recovery code", async () => {
    //update new password
    await request(app)
      .post(routerName + "/new-password")
      .send({ newPassword: "12345678", recoveryCode: 1 })
      .expect(400, {
        errorsMessages: [{ message: "Incorrect value", field: "recoveryCode" }],
      });
  });

  it("429 and not updated password cuz of too many requests", async () => {
    for (let i = 0; i < 2; i++) {
      //update new password 5 times
      await request(app)
        .post(routerName + "/new-password")
        .send({ newPassword: "12345678", recoveryCode: 1 })
        .expect(400, {
          errorsMessages: [
            { message: "Incorrect value", field: "recoveryCode" },
          ],
        });
    }
    //update new pasword 6th time
    await request(app)
      .post(routerName + "/new-password")
      .send({ newPassword: "12345678", recoveryCode: 1 })
      .expect(429);
  });

  it("204 and logouted user", async () => {
    //login
    const device = await request(app)
      .post(routerName + "/login")
      .set("X-Forwarded-For", "123456")
      .set("user-agent", "deviceForLogout")
      .send(correctLoginUserData2)
      .expect(200);
    expect(device.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device.headers["set-cookie"];
    //logout
    await request(app)
      .post(routerName + "/logout")
      .set("Cookie", refreshToken)
      .expect(204);
    //get all devices
    await request(app)
      .get("/security/devices")
      .set("Cookie", refreshToken)
      .expect(401);
  });
});
