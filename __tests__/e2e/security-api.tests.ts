import request from "supertest";
import { app } from "./../../src/settings";

const routerName = "/security";
const routerNameUsers = "/users";
const routerNameAuth = "/auth";

const login = "admin";
const password = "qwerty";

const badRefreshToken = "000000";

const correctUserData = {
  login: "good123",
  password: "goodpassword",
  email: "goodmail@mail.ru",
};

const correctUserData2 = {
  login: "bad1234",
  password: "bad1password",
  email: "bad1mail2@mail.ru",
};

const correctLoginUserData = {
  loginOrEmail: "good123",
  password: "goodpassword",
};

const correctLoginUserData2 = {
  loginOrEmail: "bad1234",
  password: "bad1password",
};

describe(routerName, () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("201 and create user1", async () => {
    //create user
    await request(app)
      .post(routerNameUsers)
      .auth(login, password)
      .send(correctUserData)
      .expect(201);
    //get users
    const result = await request(app)
      .get(routerNameUsers)
      .auth(login, password)
      .expect(200);
    expect(result.body.items[0]).toEqual({
      id: expect.any(String),
      login: "good123",
      email: "goodmail@mail.ru",
      createdAt: expect.any(String),
    });
  });

  it("201 and create user2", async () => {
    //create user
    await request(app)
      .post(routerNameUsers)
      .auth(login, password)
      .send(correctUserData2)
      .expect(201);
    //get users
    const result = await request(app)
      .get(routerNameUsers)
      .auth(login, password)
      .expect(200);
    expect(result.body.items[1]).toEqual({
      id: expect.any(String),
      login: "bad1234",
      email: "bad1mail2@mail.ru",
      createdAt: expect.any(String),
    });
  });

  it("200 and get all devices, login user 4 times from different browsers ", async () => {
    //login
    const device1 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "firstDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device1.body).toEqual({
      accessToken: expect.any(String),
    });
    //login
    const device2 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "secondDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device2.body).toEqual({
      accessToken: expect.any(String),
    });
    //login
    const device3 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "thirdDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device3.body).toEqual({
      accessToken: expect.any(String),
    });
    //login
    const device4 = await request(app)
      .post(routerNameAuth + "/login")
      .set("req.ip", "4")
      .set("user-agent", "fourthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device4.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device4.headers["set-cookie"];
    //get all devices
    const allDevices = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    expect(allDevices.body.length).toBe(4);
    expect(allDevices.body[0]).toEqual({
      deviceId: expect.any(String),
      ip: expect.any(String),
      lastActiveDate: expect.any(String),
      title: "firstDevice1",
    });
    expect(allDevices.body[3]).toEqual({
      deviceId: expect.any(String),
      ip: expect.any(String),
      lastActiveDate: expect.any(String),
      title: "fourthDevice1",
    });
  });

  it("404 and not found deviceId for delete by id", async () => {
    //login
    const device5 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "fifthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device5.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device5.headers["set-cookie"];
    //delete device
    await request(app)
      .delete(routerName + "/devices" + "/0000")
      .set("Cookie", refreshToken)
      .expect(404);
  });

  it("204 and deleted device", async () => {
    //login
    const device6 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "sixthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device6.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device6.headers["set-cookie"];
    //get all devices
    const allDevices = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    //delete device
    await request(app)
      .delete(routerName + "/devices/" + allDevices.body[5].deviceId)
      .set("Cookie", refreshToken)
      .expect(204);
  });

  it("403 and not deleted user1 device by user2", async () => {
    //login user1
    const device7 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "sixthDevice1forFake")
      .send(correctLoginUserData)
      .expect(200);
    expect(device7.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device7.headers["set-cookie"];
    //get all devices user1
    const allDevices = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    //login user2
    const device1 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "sixthDevice1forFake")
      .send(correctLoginUserData2)
      .expect(200);
    expect(device1.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken2 = device1.headers["set-cookie"];
    //delete user1 device by user2
    await request(app)
      .delete(routerName + "/devices/" + allDevices.body[0].deviceId)
      .set("Cookie", refreshToken2)
      .expect(403);
  });

  it("401 and not deleted all devices", async () => {
    //login user1
    const device8 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "eighthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device8.body).toEqual({
      accessToken: expect.any(String),
    });
    //delete all devices
    await request(app)
      .delete(routerName + "/devices")
      .set("Cookie", badRefreshToken)
      .expect(401);
  });

  it("401 and not updated refresh and access tokens", async () => {
    //login user1
    const device9 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "ningthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device9.body).toEqual({
      accessToken: expect.any(String),
    });
    //refresh tokens
    await request(app)
      .post(routerNameAuth + "/refresh-token")
      .set("Cookie", badRefreshToken);
    expect(401);
  });

  it("200 and updated refresh and access tokens", async () => {
    //login user1
    const device10 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "tenthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device10.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshTokenBefore = device10.headers["set-cookie"];
    //get all devices
    const allDevicesBefore = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshTokenBefore)
      .expect(200);
    const lasActiveDateBefore = allDevicesBefore.body[8].lastActiveDate;
    //refresh tokens
    const refreshTokens = await request(app)
      .post(routerNameAuth + "/refresh-token")
      .set("Cookie", refreshTokenBefore);
    expect(200);
    const refreshTokenAfter = refreshTokens.headers["set-cookie"];
    //get all devices
    const allDevicesAfter = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshTokenAfter)
      .expect(200);
    expect(allDevicesAfter.body[8].lastActiveDate).not.toBe(
      lasActiveDateBefore
    );
    expect(allDevicesBefore.body.length).toBe(allDevicesAfter.body.length);
  });

  it("204 and deleted first device by other device of this user", async () => {
    //login user1
    const device11 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "eleventhDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device11.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device11.headers["set-cookie"];
    //get all devices
    const allDevicesBefore = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    //delete first device
    await request(app)
      .delete(routerName + "/devices/" + allDevicesBefore.body[0].deviceId)
      .set("Cookie", refreshToken)
      .expect(204);
    //get all devices after delete
    const allDevicesAfter = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    expect(allDevicesAfter.body.length).toBe(allDevicesBefore.body.length - 1);
  });
  it("200 and get only x devices after logout", async () => {
    //login user1
    const device12 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "twelfthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device12.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshTokenBefore = device12.headers["set-cookie"];
    //get all devices
    const allDevicesBefore = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshTokenBefore)
      .expect(200);
    //logout
    await request(app)
      .post(routerNameAuth + "/logout")
      .set("Cookie", refreshTokenBefore)
      .expect(204);
    //login user1 after logout
    const device13 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "thirteenthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device13.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshTokenAfter = device13.headers["set-cookie"];
    //get all devices
    const allDevicesAfter = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshTokenAfter)
      .expect(200);
    expect(allDevicesBefore.body.length).toBe(allDevicesAfter.body.length);
  });

  it("204 and deleted all devices", async () => {
    //login user1
    const device14 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "fourteenthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device14.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device14.headers["set-cookie"];
    //delete all devices
    await request(app)
      .delete(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(204);
    //get all devices
    const allDevices = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    expect(allDevices.body.length).toBe(1);
  });

  it("401 and unreceived list of devices ", async () => {
    //get all devices
    const allDevices = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", badRefreshToken)
      .expect(401);
    expect(allDevices.body.length).toBeUndefined;
  });

  it("401 and not deleted other device of the user", async () => {
    //login user1
    const device15 = await request(app)
      .post(routerNameAuth + "/login")
      .set("user-agent", "fifteenthDevice1")
      .send(correctLoginUserData)
      .expect(200);
    expect(device15.body).toEqual({
      accessToken: expect.any(String),
    });
    const refreshToken = device15.headers["set-cookie"];
    //get all devices
    const allDevices = await request(app)
      .get(routerName + "/devices")
      .set("Cookie", refreshToken)
      .expect(200);
    //delete device
    await request(app)
      .delete(routerName + "/devices/" + allDevices.body[0].deviceId)
      .set("Cookie", badRefreshToken)
      .expect(401);
    expect(allDevices.body.length).toBe(2);
  });
});
