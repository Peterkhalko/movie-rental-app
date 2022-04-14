const supertest = require("supertest");
const app = require("../../../app");
const req = supertest(app);
const { Genre } = require("../../../models/genreModel");
const { Users } = require("../../../models/userModel");

describe("auth middleware", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });
  it("should return 403 if token is not found", async () => {
    const res = await req.post("/api/genres");
    expect(res.status).toBe(403);
  });
  it("should return 400 if invalid token is sent", async () => {
    const res = await req.post("/api/genres").set("x-auth-token", "a");
    expect(res.status).toBe(400);
  });
  it("should return 200 if valid token is sent", async () => {
    const token = new Users().getAuthToken();
    const res = await req
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
    expect(res.status).toBe(200);
  });
});
