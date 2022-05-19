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
    it("should return rental if data is present in the db", async () => {
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
    it("should return 200 if data saved successfully", async () => {
      const user = new Users({});
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Action",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "FnF9",
          genreId: genre._id,
          dailyRentalRate: 12,
          numberInStocks: 15,
        });
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });
      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-Token", token)
        .send({ customer: customer.body._id, movie: movie.body._id });

      expect(rental.status).toBe(403);
    });
    it("should retur 400 if cusomerId not found", async () => {
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
      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-token", token)
        .send({ movie: movie.body._id });
      expect(rental.status).toBe(404);
    });
    it("should retur 400 if movieId not found", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const customer = await req
        .post("/api/customers")
        .set("x-Auth-token", token)
        .send({ name: "peter", phone: "1234567891", isGold: true });

      const rental = await req
        .post("/api/rentals")
        .set("x-Auth-token", token)
        .send({ customer: customer.body._id });
      expect(rental.status).toBe(404);
    });
    it("should return 400 if numberInStocks is 0", async () => {
      const genre = new Genre({ name: "genre" });
      await genre.save();
      const customer = new Customer({
        name: "customer",
        phone: "1234567890",
      });
      await customer.save();
      const movie = new Movie({
        title: "movie",
        dailyRentalRate: 1.1,
        numberInStocks: 0,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const user = new Users();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customer: customer._id, movie: movie._id });

      expect(res.status).toBe(400);
    });
    it("should decrement numberInStock of the chosen movie by 1", async () => {
      const genre = new Genre({ name: "genre" });
      await genre.save();
      const customer = new Customer({
        name: "customer",
        phone: "1236567890",
      });
      await customer.save();
      let movie = new Movie({
        title: "movie",
        dailyRentalRate: 1.1,
        numberInStocks: 10,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const user = new Users();
      const token = user.getAuthToken();
      await req
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customer: customer._id, movie: movie._id });
      movie = await Movie.findById(movie._id);
      expect(movie.numberInStocks).toBe(9);
    });
  });
  describe("PATCH /:id", () => {
    it("should return 403 if token is not provided", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.patch("/api/rentals/" + id);
      expect(res.status).toBe(403);
    });
    it("should return 404 if invalid id is send", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const res = await req.patch("/api/rentals/1").set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should update rental if data is valid", async () => {
      const genre = new Genre({ name: "genre" });
      await genre.save();
      const customer = new Customer({
        name: "customer",
        phone: "1240567890",
      });
      await customer.save();
      const movie = new Movie({
        title: "movie",
        dailyRentalRate: 1.1,
        numberInStocks: 10,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const rental = new Rentals({
        customer: {
          name: customer.name,
          phone: customer.phone,
          _id: customer._id,
        },
        movie: {
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
          _id: movie._id,
        },
        rentalFee: 40,
      });
      await rental.save();
      const token = new Users().getAuthToken();
      await req
        .patch("/api/rentals/" + rental._id)
        .set("x-auth-token", token)
        .send({ dateIn: new Date() });
      const res = await Rentals.findOne({ "movie.title": "movie" });
      expect(res.dateIn).not.toBeNull();
    });
    it("should send updated rental if data is valid", async () => {
      const genre50 = new Genre({ name: "genre50" });
      await genre50.save();
      const customer50 = new Customer({
        name: "customer50",
        phone: "125056789",
      });
      await customer50.save();
      const movie50 = new Movie({
        title: "movie50",
        dailyRentalRate: 1.1,
        numberInStock: 10,
        genre: { name: genre50.name, _id: genre50._id },
      });
      await movie50.save();
      let rental = new Rental({
        customer: {
          name: customer50.name,
          phone: customer50.phone,
          _id: customer50._id,
        },
        movie: {
          title: movie50.title,
          dailyRentalRate: movie50.dailyRentalRate,
          _id: movie50._id,
        },
        rentalFee: 50,
      });
      await rental.save();
      const token = new User().getAuthToken();
      const res = await req
        .patch("/api/rentals/" + rental._id)
        .set("x-auth-token", token)
        .send({ dateIn: new Date() });
      expect(res.body.dateIn).not.toBeNull();
    });
    it("should increment numberInStock of chosen movie by 1 data is valid", async () => {
      const genre55 = new Genre({ name: "genre55" });
      await genre55.save();
      const customer55 = new Customer({
        name: "customer55",
        phone: "125556789",
      });
      await customer55.save();
      let movie55 = new Movie({
        title: "movie55",
        dailyRentalRate: 1.1,
        numberInStock: 10,
        genre: { name: genre55.name, _id: genre55._id },
      });
      await movie55.save();
      let rental = new Rental({
        customer: {
          name: customer55.name,
          phone: customer55.phone,
          _id: customer55._id,
        },
        movie: {
          title: movie55.title,
          dailyRentalRate: movie55.dailyRentalRate,
          _id: movie55._id,
        },
        rentalFee: 55,
      });
      await rental.save();
      const token = new User().getAuthToken();
      await req
        .patch("/api/rentals/" + rental._id)
        .set("x-auth-token", token)
        .send({ dateIn: new Date() });
      movie55 = await Movie.findById(movie55._id);
      expect(movie55.numberInStock).toBe(11);
    });
  });
});
