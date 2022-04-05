const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app");
const req = supertest(app);
const { Users } = require("../../../models/userModel");
const { Genre, validateGenre } = require("../../../models/genreModel");

describe("/api/genres", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all the genre", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await req.get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((g) => {
          return (g.name = "genre1");
        })
      ).toBeTruthy();
      expect(
        res.body.some((g) => {
          return (g.name = "genre2");
        })
      ).toBeTruthy();
    });
    it("should return", async () => {
      const res = await req.get("/api/genres");
      expect(res.status).toBe(404);
    });
  });
  describe("GET/:id", () => {
    it("should retun 404 if invalid id(id with no data) is passed", async () => {
      const res = await req.get("/api/genres/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if invalid object id is passed ", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/api/genres/", id);
      expect(res.status).toBe(404);
    });
    it("should return 200 when data is found", async () => {
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
    it("should return 403(Access denied) if token is not found", async () => {
      const res = await req.post("/api/genres");
      expect(res.status).toBe(403);
    });
    it("should return the 400 if genre name character is less than 3 character", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "pe" });
      expect(res.status).toBe(400);
    });
    it("should return the 400 if genre name character is more than 10 character", async () => {
      const user = new Users();
      console.log(user);
      const token = user.getAuthToken();
      console.log(token);
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "peterkhalkonagpurmernstack" });
      expect(res.status).toBe(400);
    });
    it("should return the 200/save the genre", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Drama" });
      expect(res.status).toBe(200);
      const genre = await Genre.findOne({ name: "Drama" });
      expect(genre).not.toBeNull();
      expect(genre).toHaveProperty("name", "Drama");
    });
    it("should return the genre", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Drama" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Drama");
    });
  });
  describe("PUT /", () => {
    it("should retune ", () => {});
  });
});
