import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
import HttpStatus from "../src/enums/httpStatus.js";

let testSession = null;
/**
 * Create a super test session and initiate the database before running tests.
 */
beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  await testBase.resetDatabase(db);
});

/**
 * Reset the database after every test case
 */
afterEach(async () => {
  await testBase.resetDatabase(db);
});

/**
 * Take down the app once test execution is done
 */
afterAll((done) => {
  app.close(done);
});

describe("Post authentication tasks", () => {
  var authenticatedSession = null;
  var authToken = null;
  beforeAll(async () => {
    const result = await testBase.authenticateAdminTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
  });

  test("Challenge 3.a - Add a new movie", async () => {
    const movie = {
      title: "Batman Begins",
      year: 2005,
      dailyRentalRate: 2.5,
      genres: ["Action", "Adventure"],
      imdbRating: 8.2,
      posterUrl:
        "https://www.imdb.com/title/tt0372784/mediaviewer/rm4261716480/",
      bannerUrl:
        "https://www.imdb.com/title/tt0372784/mediaviewer/rm4261716480/",
      plot: "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.",
      runtime: "2hr 20min",
      directedBy: "Christopher Nolan",
      starring: "Christian Bale, Michael Caine, Ken Watanabe",
      releaseAt: "2024-10-20T00:00:00.000Z",
    };

    const res = await authenticatedSession
      .post(`/api/movie/`)
      .send(movie)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.data.title).toEqual("Batman Begins");

    const res1 = await authenticatedSession
      .post(`/api/movie/`)
      .send(movie)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res1.status).toBe(HttpStatus.BAD_REQUEST);
  });

  test("Challenge 3.b - Update daily rental rate of a movie", async () => {
    const movieId = "b5f37e47-40a7-4688-b6aa-420356eabcf8";

    const res = await authenticatedSession
      .patch(`/api/movie/b5f37e47-40a7-4688-b6aa-420356eabcf8`)
      .send({ dailyRentalRate: 150 })
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.data.dailyRentalRate).toEqual(150);
  });

  test("Challenge 3.c - add genre", async () => {
    const response1 = await authenticatedSession
      .post(`/api/genre/`)
      .send({
        name: "Romance",
      })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response1.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response1.body.message).toEqual("Genre already exists");

    const response2 = await authenticatedSession
      .post(`/api/genre/`)
      .send({
        name: "Horror",
      })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response2.status).toBe(HttpStatus.CREATED);
    expect(response2.body.data.name).toEqual("Horror");
  });
});
