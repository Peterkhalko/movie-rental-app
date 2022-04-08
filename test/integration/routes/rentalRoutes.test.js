const app = require("../../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const req = supertest(app);
const { Genre } = require("../../../models/genreModel");
const { Customer } = require("../../../models/customerModel");
const { Users } = require("../../../models/userModel");
const { Movie } = require("../../../models/movieModel");
const { Rentals } = require("../../../models/rentalModel");

describe("/api/rentals", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
    await Customer.deleteMany({});
    await Movie.deleteMany({});
    await Rentals.deleteMany({});
  });
  describe("GET /", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.get("/api/rentals/1");
      expect(res.status).toBe(404);
    });
    it("should return 200 if data is present in the db", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });

      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-token", token)
        .send({ customer: customer.body._id, movie: movie.body._id });

      const res = await req.get("/api/rentals");
      expect(res.status).toBe(200);
    });
    it("should return return movie if data is present in the db", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });

      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-token", token)
        .send({ customer: customer.body._id, movie: movie.body._id });

      const res = await req.get("/api/rentals");
      expect(res.status).toBe(200);
    });
  });
  describe("GET /:id", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.get("/api/rentals/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if ObjectId data is not present in the db", async () => {
      const res = await req.get("/api/rentals/624c224ae039375a7d195a94");
      expect(res.status).toBe(404);
    });
    it("should return return 200 if data is present in the db", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });

      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-token", token)
        .send({ customer: customer.body._id, movie: movie.body._id });

      const res = await req.get("/api/rentals/" + rental.body._id);
      expect(res.status).toBe(200);
    });
    it("should return return movie if data is present in the db", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });

      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-token", token)
        .send({ customer: customer.body._id, movie: movie.body._id });
      const res = await req.get("/api/rentals/" + rental.body._id);
      expect(res.body).toHaveProperty("customer.name", "peter");
      expect(res.body).toHaveProperty("customer.phone", "1234567891");
      expect(res.body).toHaveProperty("movie.title", "romeo");
      expect(res.body).toHaveProperty("movie.dailyRentalRate", 2);
      expect(res.body).toHaveProperty("dateIn", null);
    });
  });
  describe("POST /", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.get("/api/rentals/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if ObjectId data is not present in the db", async () => {
      const res = await req.get("/api/rentals/624c224ae039375a7d195a94");
      expect(res.status).toBe(404);
    });
    it("should return 403 if no token found", async () => {
      const user = new Users({});
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });
      const rental = await req
        .post("/api/rentals")
        .send({ customer: customer.body._id, movie: movie.body._id });
      expect(rental.status).toBe(403);
    });
    it("should return 403 if no token found", async () => {
      const user = new Users({});
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });
      const rental = await req
        .post("/api/rentals")
        .send({ customer: customer.body._id, movie: movie.body._id });
      expect(rental.status).toBe(403);
    });
    // it("should return 200 if data saved successfully", async () => {
    //   const user = new Users({});
    //   const token = user.getAuthToken();
    //   const genre = new Genre({
    //     name: "Action",
    //   });
    //   await genre.save();
    //   const movie = await req
    //     .post("/api/movies")
    //     .set("x-Auth-Token", token)
    //     .send({
    //       title: "FnF9",
    //       genreId: genre._id,
    //       dailyRentalRate: 12,
    //       numberInStocks: 15,
    //     });
    //   const customer = await req
    //     .post("/api/customers")
    //     .set("x-Auth-token", token)
    //     .send({ name: "peter", phone: "1234567891", isGold: true });
    //   const rental = await req
    //     .post("/api/rentals")
    //     .set("x-Auth-Token", token)
    //     .send({ customer: customer.body._id, movie: movie.body._id });

    //   expect(rental.status).toBe(403);
    // });
  });
});
