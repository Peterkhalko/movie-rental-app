const app = require("../../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const req = supertest(app);
const { Customer } = require("../../../models/customerModel");
const { Users } = require("../../../models/userModel");

describe("/api/customers", () => {
  afterEach(async () => {
    await Customer.deleteMany({});
  });
  describe("GET /", () => {
    it("should return customer", async () => {
      const customer = new Customer({
        name: "Peter",
        phone: "1234567890",
      });
      await customer.save();
      const res = await req.get("/api/customers");
    });
    it("should return 404 if no data found in db ", async () => {
      const res = await req.get("/api/customers");
      expect(res.status).toBe(404);
    });
    it("should return status code 200 when data found", async () => {
      const customer = new Customer({
        name: "test",
        phone: "1234567890",
      });
      await customer.save();
      const res = await req.get("/api/customers/");
      expect(res.status).toBe(200);
    });
  });
  describe("GET /:id", () => {
    it("should return 404 if ObjectId format type is incorrect", async () => {
      const id = "testingString";
      const res = await req.get("/api/customers/" + id);
      expect(res.status).toBe(404);
    });
    it("should return 404 if objectId does not exist", async () => {
      const id = "624c1403bbeab43c902f506d";
      const res = await req.get("/api/customers/" + id);
      expect(res.status).toBe(404);
    });
    it("should return the customer if data is found", async () => {
      const customer = new Customer({
        name: "test",
        phone: "1234567890",
        isGold: true,
      });
      await customer.save();
      const res = await req.get("/api/customers/" + customer._id);
      expect(res.body).toHaveProperty("name", "test");
    });
    it("should return 200 status code if data is found", async () => {
      const customer = new Customer({
        name: "test",
        phone: "1234567890",
        isGold: true,
      });
      await customer.save();
      const res = await req.get("/api/customers/" + customer._id);
      expect(res.status).toBe(200);
    });

    describe("POST /", () => {
      it("should return status code 403 if no token found", async () => {
        const res = await req.post("/api/customers");
        expect(res.status).toBe(403);
      });
      it("should return status 400 if token if invalid", async () => {
        const token = "my name khan";
        const res = await req
          .post("/api/customers")
          .set("x-auth-token", token)
          .send({
            name: "test",
            phone: "12345676890",
          });
        expect(res.status).toBe(400);
      });
      it("should return 400 if min name lenght is less than 2 char", async () => {
        const user = new Users();
        const token = user.getAuthToken();
        const res = await req
          .post("/api/customers")
          .set("x-auth-token", token)
          .send({ name: "p", phone: "1234567890", isGold: true });
        expect(res.status).toBe(400);
      });
      it("should return 400 if max phone lenght is more than 10 char", async () => {
        const user = new Users();
        const token = user.getAuthToken();
        const res = await req
          .post("/api/customers")
          .set("x-auth-token", token)
          .send({ name: "peter", phone: "12345678913245", isGold: true });
        expect(res.status).toBe(400);
      });
      it("should return 200 if customer saved successfully", async () => {
        const user = new Users();
        const token = user.getAuthToken();
        const res = await req
          .post("/api/customers")
          .set("x-auth-token", token)
          .send({ name: "peter", phone: "1234567891", isGold: true });
        expect(res.status).toBe(200);
      });
      it("should return 200 if customer saved successfully", async () => {
        const user = new Users();
        const token = user.getAuthToken();
        const res = await req
          .post("/api/customers")
          .set("x-auth-token", token)
          .send({ name: "peter", phone: "1234567891", isGold: true });
        expect(res.body).toHaveProperty("name", "peter");
        expect(res.body).toHaveProperty("phone", "1234567891");
      });
    });
  });
});
