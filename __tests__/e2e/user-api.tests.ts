import request from "supertest";
import { app } from "./../../src/settings";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const routerName = "/users";

const login = "admin";
const password = "qwerty";

const correctUserData = {
  login: "good",
  password: "goodpassword",
  email: "goodmail@mail.ru",
};
const correctUserData2 = {
  login: "good2",
  password: "goodpassword2",
  email: "goodmail2@mail.ru",
};

const incorrectUserData = {
  login: "l",
  password: "p",
  email: "e",
};

const emptyUserData = {
  login: "",
  password: "",
  email: "",
};

const overLengthUserData = {
  login: "aaaaaaaaaaaaaaaaaa",
  password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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

    let testUser1: any;
    let testUser2: any;

    it("200 and empty array of users", async () => {
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("400 and not created user with incorrect data", async () => {
      //create user
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
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("400 and not created user with empy data", async () => {
      //create user
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
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("400 and not created user with overlength login and password", async () => {
      //create user
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
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("401 and not created user with incorrect authorization", async () => {
      //create user
      await request(app)
        .post(routerName)
        .auth("badlogin", "badpassword")
        .send(correctUserData)
        .expect(401);
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("201 and created user with correct all data(only testUser1)", async () => {
      //create user
      const res = await request(app)
        .post(routerName)
        .auth(login, password)
        .send(correctUserData)
        .expect(201);
      testUser1 = res.body;
      //get users
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

    it("201 and created user with correct all data(testUser1 and testUser2)", async () => {
      //create user
      const res = await request(app)
        .post(routerName)
        .auth(login, password)
        .send(correctUserData2)
        .expect(201);
      testUser2 = res.body;
      //get users
      const result = await request(app)
        .get(routerName)
        .auth(login, password)
        .expect(200);
      expect(result.body.items.length).toBe(2);
    });

    it("200 and correct all data", async () => {
      //get users
      const result = await request(app)
        .get(routerName)
        .auth(login, password)
        .expect(200);
      expect(result.body.items.length).toBe(2);
    });

    it("404 and not deleted user with incorrect id and get all data", async () => {
      //delete user
      await request(app)
        .delete(routerName + "/" + new ObjectId().toString())
        .auth(login, password)
        .expect(404);
      //get users
      const result = await request(app)
        .get(routerName)
        .auth(login, password)
        .expect(200);
      expect(result.body.items.length).toBe(2);
    });

    it("401 and not deleted testUser1 with incorrect authorization", async () => {
      //delete user
      await request(app)
        .delete(routerName + "/" + testUser1.id)
        .auth("badlogin", "badpassword")
        .send(correctUserData)
        .expect(401);
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("401 and not deleted testUser2 with incorrect authorization", async () => {
      //delete user
      await request(app)
        .delete(routerName + "/" + testUser2.id)
        .auth("badlogin", "badpassword")
        .send(correctUserData)
        .expect(401);
      //get users
      await request(app).get(routerName).auth(login, password).expect(200);
    });

    it("204 and deleted user with correct id and array with 1 users", async () => {
      //get users
      const res = await request(app).get(routerName).auth(login, password);
      const startUsersArrayLength = res.body.items.length;
      //delete user
      await request(app)
        .delete(routerName + "/" + testUser1.id)
        .auth(login, password)
        .expect(204);
      //get users
      const result = await request(app)
        .get(routerName)
        .auth(login, password)
        .expect(200);
      expect(result.body.items.length).toBe(startUsersArrayLength - 1);
    });

    it("204 and deleted user with correct id and array with 0 users", async () => {
      //get users
      const res = await request(app).get(routerName).auth(login, password);
      const startUsersArrayLength = res.body.items.length;
      //delete user
      await request(app)
        .delete(routerName + "/" + testUser2.id)
        .auth(login, password)
        .expect(204);
      //get users
      const result = await request(app)
        .get(routerName)
        .auth(login, password)
        .expect(200);
      expect(result.body.items.length).toBe(startUsersArrayLength - 1);
    });
  });
});
