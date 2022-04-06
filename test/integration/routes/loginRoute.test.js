const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app");
const req = supertest(app);
const { Users } = require("../../../models/userModel");

describe("login /", () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });
  describe("LOGIN /", () => {
    it("should return 400 if email id custom validation(JOI) fails", async () => {
      const res = await req.post("/api/login").send({
        email: "test",
        password: "123#Peter12",
      });
      expect(res.status).toBe(400);
    });
    it("should return 400 if password id  validation(JOI) fails", async () => {
      const res = await req.post("/api/login").send({
        email: "peter@gmail.com",
        password: "test",
      });
      expect(res.status).toBe(400);
    });
    it("should return 400 if user email id does not exist", async () => {
      const user = await req.post("/api/users").send({
        name: "Peter",
        email: "peter@gmail.com",
        password: "12345Peter@hello",
        isAdmin: true,
      });
      const res = await req.post("/api/login").send({
        email: "eter@gmail.com",
        password: "12345Peter@hello",
      });
      expect(res.status).toBe(400);
    });
    it("should return 400 if user Password does not match", async () => {
      const user = await req.post("/api/users").send({
        name: "Peter",
        email: "peter@gmail.com",
        password: "12345Peter@hello",
        isAdmin: true,
      });
      const res = await req.post("/api/login").send({
        email: "peter@gmail.com",
        password: "1345Peter@hello",
      });
      expect(res.status).toBe(400);
    });
    it("should generate a token when user logsin", async () => {
      const user = await req.post("/api/users").send({
        name: "Peter",
        email: "peter@gmail.com",
        password: "12345Peter@hello",
        isAdmin: true,
      });
      const res = await req.post("/api/login").send({
        email: "peter@gmail.com",
        password: "12345Peter@hello",
      });
      const userToCreateToken = new Users({
        name: "Peter",
        email: "peter@gmail.com",
        password: "12345Peter@hello",
        isAdmin: true,
      });
      expect(userToCreateToken.getAuthToken).toBe(
        userToCreateToken.getAuthToken
      );
    });
  });
});
