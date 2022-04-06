const app = require("../../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const req = supertest(app);
const { Genre } = require("../../../models/genreModel");
const { Movie } = require("../../../models/movieModel");
const { Users } = require("../../../models/userModel");

describe("/api/movies", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });
  describe("GET /", () => {
    it("should return 404 if no movie found to display", async () => {
      const movies = await req.get("/api/movies");
      expect(movies.status).toBe(404);
    });
    it("should return 200 if movie/movies found to display", async () => {
      const genre = new Genre({
        name: "Drama",
      });
      const movie = new Movie({
        title: "romeo",
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStocks: 30,
        dailyRentalRate: 50,
      });
      await genre.save();
      await movie.save();
      const movies = await req.get("/api/movies");
      expect(movies.status).toBe(200);
    });
    it("should return movie details", async () => {
      const genre = new Genre({
        name: "Drama",
      });
      const movie = new Movie({
        title: "romeo",
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStocks: 30,
        dailyRentalRate: 50,
      });
      await movie.save();
      const movies = await req.get("/api/movies");
      expect(movies.body[0]).toHaveProperty("title", "romeo");
    });
  });
  describe("GET /:id", () => {
    it("should return 404 if ObjectId type did not match", async () => {
      const res = await req.get("/api/movies/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if ObjectId is not present in the db", async () => {
      const res = await req.get("/api/movies/624c224ae039375a7d195a94");
      expect(res.status).toBe(404);
    });
    it("should return 200 if movie found", async () => {
      const genre = new Genre({
        name: "Drama",
      });
      const movie = new Movie({
        title: "romeo",
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStocks: 30,
        dailyRentalRate: 50,
      });
      await movie.save();
      const res = await req.get("/api/movies/" + movie._id);
      expect(res.status).toBe(200);
    });
    it("should return movie found", async () => {
      const genre = new Genre({
        name: "Drama",
      });
      const movie = new Movie({
        title: "romeo",
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStocks: 30,
        dailyRentalRate: 50,
      });
      await movie.save();
      const res = await req.get("/api/movies/" + movie._id);
      expect(res.body).toHaveProperty("numberInStocks", 30);
      expect(res.body).toHaveProperty("dailyRentalRate", 50);
      expect(res.body).toHaveProperty("genre.name", "Drama");
    });
  });
  describe("POST /:id", () => {
    // it("should return 403 if token not found", async () => {
    //   const res = await req.post("/api/movies");
    //   expect(res.status).toBe(403);
    // });
    // it("should return 400 if numberInStocks is less than 0 number", async () => {
    //   const user = new Users();
    //   const token = user.getAuthToken();
    //   const genre = new Genre({
    //     name: "Adventure",
    //   });
    //   const movie = new Movie({
    //     title: "Fast n furious",
    //     genre: {
    //       _id: genre._id,
    //       name: genre.name,
    //     },
    //     numberInStocks: 5,
    //     dailyRentalRate: 10,
    //   });
    //   const res = await req
    //     .post("/api/movies")
    //     .set("x-Auth-Token", token)
    //     .send(movie);
    //   expect(res.status).toBe(400);
    // });
    // it("should return 400 if genre required field is not given in req body", async () => {
    //   const user = new Users();
    //   const token = user.getAuthToken();
    //   const genre = new Genre({
    //     name: "Adventure",
    //   });
    //   const movie = new Movie({
    //     title: "Fast n furious",
    //     numberInStocks: 5,
    //     dailyRentalRate: 10,
    //   });
    //   const res = await req
    //     .post("/api/movies")
    //     .set("x-Auth-Token", token)
    //     .send(movie);
    //   expect(res.status).toBe(400);
    // });
    // it("should return 400 if title is more than 255 char", async () => {
    //   const user = new Users();
    //   const token = user.getAuthToken();
    //   const genre = new Genre({
    //     name: "Adventure",
    //   });
    //   const movie = new Movie({
    //     title: new Array(50).join("test"),
    //     genre: {
    //       _id: genre._id,
    //       name: genre.name,
    //     },
    //     numberInStocks: 5,
    //     dailyRentalRate: 10,
    //   });
    //   const res = await req
    //     .post("/api/movies")
    //     .set("x-Auth-Token", token)
    //     .send(movie);
    //   expect(res.status).toBe(400);
    // });
    it("should return 200 if the data is saved sucessfully", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      const movie = new Movie();
      const res = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Jungle Safari",
          genreId: genre._id,
          numberInStocks: 5,
          dailyRentalRate: 10,
        });
      console.log(res.body);
    });
  });
});
