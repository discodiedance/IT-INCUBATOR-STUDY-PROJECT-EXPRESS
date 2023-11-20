import request from "supertest";
import { app } from "./../../src/settings";

describe("/testing", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });
  it("Get status 200 and found empty array of blogs, posts, videos", async () => {
    await request(app).get("/blogs").expect(200, []);
    await request(app).get("/posts").expect(200, []);
  });
});
