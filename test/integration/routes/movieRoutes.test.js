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
    it("should return 404  no movie found to display", async () => {
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
      await movie.save();
      const res = await req.get("/api/movies/");
      expect(res.status).toBe(200);
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
    it("should return 403 if token not found", async () => {
      const res = await req.post("/api/movies");
      expect(res.status).toBe(403);
    });
    it("should return 400 if numberInStocks is less than 0 number", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "testing",
      });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          genreId: genre._id,
          dailyRentalRate: -2,
          numberInStocks: 255,
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre required field is not given in req body", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "romeo",
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if title is more than 255 char", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Adventure",
      });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: new Array(255).join("test"),
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });

      expect(res.status).toBe(400);
    });
    it("should return 200 if the data is saved sucessfully", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });

      expect(res.status).toBe(200);
    });
    it("should return 200 if the movie is returned sucessfully", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });

      expect(res.body).toHaveProperty("title", "Adolf Hitler");
      expect(res.body).toHaveProperty("dailyRentalRate", 2);
      expect(res.body).toHaveProperty("numberInStocks", 255);
    });
  });
  describe("PUT /:id", () => {
    it("should return 404 if ObjectId fomat Type is not valid", async () => {
      const res = await req.put("/api/movies/123");
      expect(res.status).toBe(404);
    });
    it("should return 403 if no token found", async () => {
      const res = await req.put("/api/movies/624bd4a0e6645be1ca255549");
      expect(res.status).toBe(403);
    });
    it("should return 400 if numberInStocks is less than 0 number", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      const res = await req
        .put("/api/movies/" + movie.body._id)
        .set("x-Auth-token", token)
        .send({
          title: "something",
          genreId: genre._id,
          dailyRentalRate: 25,
          numberInStocks: -15,
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if title char length is more than 255 char", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      const res = await req
        .put("/api/movies/" + movie.body._id)
        .set("x-Auth-token", token)
        .send({
          title: new Array(259).join("p"),
          genreId: genre._id,
          dailyRentalRate: 25,
          numberInStocks: 15,
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre id is not given", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      const res = await req
        .put("/api/movies/" + movie.body._id)
        .set("x-Auth-token", token)
        .send({
          title: new Array(259).join("p"),
          dailyRentalRate: 25,
          numberInStocks: 15,
        });
      expect(res.status).toBe(400);
    });
    it("should return 200 if Put data is successfully saved", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      const res = await req
        .put("/api/movies/" + movie.body._id)
        .set("x-Auth-token", token)
        .send({
          title: "Life of pie",
          genreId: genre._id,
          dailyRentalRate: 15,
          numberInStocks: 155,
        });
      expect(res.status).toBe(200);
    });
    it("should return movie object if Put data is successfully saved", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      const res = await req
        .put("/api/movies/" + movie.body._id)
        .set("x-Auth-token", token)
        .send({
          title: "Life of Pie",
          genreId: genre._id,
          dailyRentalRate: 15,
          numberInStocks: 155,
        });
      expect(res.body).toHaveProperty("title", "Life of Pie");
    });
  });
  describe("DELETE /:id", () => {
    it("should return 403 if token not found", async () => {
      const res = await req.delete("/api/movies/624ec1b93f5bd152bb753ccc");
      expect(res.status).toBe(403);
    });
    it("should return 403 if user token does not contain isAdmin:true property", async () => {
      const user = new Users();
      const token = user.getAuthToken();
      const res = await req
        .delete("/api/movies/624ec1b93f5bd152bb753ccc")
        .set("x-Auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return 404 if ObjectId fomat Type is not valid", async () => {
      const res = await req.delete("/api/movies/123");
      expect(res.status).toBe(404);
    });
    it("should return 400 if ObjectId not found to delete", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const res = await req
        .delete("/api/movies/624ec1b93f5bd152bb753ccc")
        .set("x-Auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return 200 if data deleted successfully", async () => {
      const user = new Users({
        isAdmin: true,
      });
      const token = user.getAuthToken();
      const genre = new Genre({
        name: "Drama",
      });
      await genre.save();
      const movie = await req
        .post("/api/movies")
        .set("x-Auth-Token", token)
        .send({
          title: "Adolf Hitler",
          genreId: genre._id,
          dailyRentalRate: 2,
          numberInStocks: 255,
        });
      const res = await req
        .delete("/api/movies/" + movie.body._id)
        .set("x-Auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});
