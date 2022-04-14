const app = require("../../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const req = supertest(app);
const { Users } = require("../../../models/userModel");

describe("/api/users", () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });
  describe("GET /", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.get("/api/users/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if ObjectId not present", async () => {
      const res = await req.get("/api/users/624d99a578fc10bdcf0ffb77");
      expect(res.status).toBe(404);
    });
    it("should return 200 if data is present", async () => {
      const user = await req.post("/api/users").send({
        name: "Peter",
        email: "test@gmail.com",
        password: "test@1234",
      });
      const res = await req.get("/api/users/");
      expect(res.status).toBe(200);
    });
  });
  describe("GET /:id", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.get("/api/users/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if ObjectId not present", async () => {
      const res = await req.get("/api/users/624d99a578fc10bdcf0ffb77");
      expect(res.status).toBe(404);
    });
    it("should return 200 if data is present", async () => {
      const user = await req.post("/api/users").send({
        name: "Peter",
        email: "test@gmail.com",
        password: "test@1234",
      });
      const res = await req.get("/api/users/" + user.body._id);
      expect(res.status).toBe(200);
    });
  });
  describe("POST /", () => {
    it("should return 400 if name length is less than 2 character", async () => {
      const user = await req.post("/api/users").send({
        name: "P",
        email: "test@gmail.com",
        password: "test@1234",
      });
      expect(user.status).toBe(400);
    });
    it("should return 400 if email length is less than 5 character", async () => {
      const user = await req.post("/api/users").send({
        name: "Pe",
        email: "teom",
        password: "test@1234",
      });
      expect(user.status).toBe(400);
    });
    it("should return 400 if password lenght is less than 5 character", async () => {
      const user = await req.post("/api/users").send({
        name: "Pe",
        email: "teom@gmail.com",
        password: "123456",
      });
      expect(user.status).toBe(200);
    });
    it("should return 400 if email already exists", async () => {
      const user1 = new Users({
        name: "one",
        email: "one@gmail.com",
        password: "test@1234",
      });
      await user1.save();
      const user = await req.post("/api/users").send({
        name: "two",
        email: "one@gmail.com",
        password: "test@1234",
      });
      expect(user.status).toBe(409);
    });
    it("should return 200 if data saved successfully already exists", async () => {
      const user = await req.post("/api/users").send({
        name: "two",
        email: "one@gmail.com",
        password: "test@1234",
      });
      expect(user.status).toBe(200);
    });
    it("should return user object if data returned successfully", async () => {
      const user = await req.post("/api/users").send({
        name: "two",
        email: "one@gmail.com",
        password: "test@1234",
      });
      expect(user.body).toHaveProperty("name", "two");
      expect(user.body).toHaveProperty("email", "one@gmail.com");
      expect(user.body).toHaveProperty("isAdmin", false);
      expect(user.body).not.toHaveProperty("password", "test@1234");
    });
  });
  describe("DELETE /:id", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.delete("/api/users/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if ObjectId not present", async () => {
      const res = await req.delete("/api/users/624d99a578fc10bdcf0ffb77");
      expect(res.status).toBe(404);
    });
    it("should return 200 if data deleted successfully", async () => {
      const user = await req.post("/api/users").send({
        name: "two",
        email: "one@gmail.com",
        password: "test@1234",
      });
      const res = await req.delete("/api/users/" + user.body._id);
      expect(res.status).toBe(200);
    });
    it("should return user object if data returned successfully ", async () => {
      const user = await req.post("/api/users").send({
        name: "two",
        email: "one@gmail.com",
        password: "test@1234",
      });
      const res = await req.delete("/api/users/" + user.body._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "two");
      expect(res.body).toHaveProperty("email", "one@gmail.com");
      expect(res.body).toHaveProperty("isAdmin", false);
      expect(res.body).not.toHaveProperty("password", "test@1234");
    });
  });
});
