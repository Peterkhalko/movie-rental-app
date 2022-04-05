const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../index");
const req = supertest(app);
const { User } = require("../../../model/userModel");
const { Genre, validateGenre } = require("../../../model/genreModel");

describe("/api/genres", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });
  describe(" GET /", () => {
    it("should return all the genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await req.get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name == "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name == "genre2")).toBeTruthy();
    });
    it("should return 404 if genre are not found", async () => {
      const res = await req.get("/api/genres");
      expect(res.status).toBe(404);
    });
  });
  describe("GET /:id", () => {
    it("should return 400 if  invalid id is passed", async () => {
      const res = await req.get("/api/genres/1");
      expect(res.status).toBe(400);
    });
    it("should return 404 if  valid id passed but genre not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
    it("should return 200 genre when valid id passed", async () => {
      const genre = new Genre({
        name: "genre1",
      });
      await genre.save();
      const res = await req.get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
  describe("POST /", () => {
    it("should return  401 if token is not found", async () => {
      const res = await req.post("/api/genres");
      expect(res.status).toBe(401);
    });
    it("should return  400 if invalid input less than 3 charecter genre", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "g1" });
      expect(res.status).toBe(400);
    });
    it("should return  400 if invalid input greater than 10 charecter genre", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "aaaaaaaaaaaa" });
      expect(res.status).toBe(400);
    });
    it("should save the genre", async () => {
      const user = new User();
      const token = user.getAuthToken();
      await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });
      const genre = await Genre.findOne({ name: "genre1" });
      expect(genre).not.toBeNull();
      expect(genre).toHaveProperty("name", "genre1");
    });
    it("should return the genre", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
  describe("PUT /:id", () => {
    it("should return 400 if invalid id is passed", async () => {
      const res = await req.put("/api/genres/1");
      expect(res.status).toBe(400);
    });
    it("should return 404 if  valid id passed but genre not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });

    it("should return  400 if token is invalid", async () => {
      const res = await req.put("/api/genres/1").set("x-auth-token", "a");
      expect(res.status).toBe(400);
    });
  });
});
