import request from "supertest";
import { app } from "./../../src/settings";

describe("/blogs", () => {
  beforeAll(async () => {
    await request(app).delete("/testing-all-data");
  });
});

describe("/posts", () => {
  beforeAll(async () => {
    await request(app).delete("/testing-all-data");
  });
});

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete("/testing-all-data");
  });
});
