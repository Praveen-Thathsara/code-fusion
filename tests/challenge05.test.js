import { beforeAll, afterAll, afterEach, test, describe, expect } from "vitest";

import app from "../src/server.js";
import db from "../db/db-config.js";
import HttpStatus from "../src/enums/httpStatus.js";
import testBase from "./testBase.js";

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
  let authenticatedSession = null;
  let authToken = null;
  let authenticatedUserId = null;

  beforeAll(async () => {
    const result = await testBase.authenticateTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
    authenticatedUserId = result.userId;
  });

  const movieId = "b5f37e47-40a7-4688-b6aa-420356eabcf8";
  const upcomingMovieId = "e3d0cd0e-4150-4118-a227-329dfae69d9f";

  test("challenge 5.a - add a rental", async () => {

    const response1 = await authenticatedSession
      .post("/api/rental/")
      .send({
        movieId: movieId,
        daysRented: 4,
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(response1.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response1.body.message).toBe("Insufficient balance");

    const response2 = await authenticatedSession
      .post("/api/rental/")
      .send({
        movieId: movieId,
        daysRented: 2,
      })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response2.status).toBe(HttpStatus.CREATED);
    expect(response2.body.data.movieId).toBe(movieId);
    expect(response2.body.data.rentalFee).toBe(200);

    const user = await authenticatedSession
      .get(`/api/user/${authenticatedUserId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(user.status).toBe(HttpStatus.OK);
    expect(user.body.data.balance).toBe(0);

    const response3 = await authenticatedSession
      .post("/api/rental/")
      .send({
        movieId: movieId,
        daysRented: 2,
      })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response3.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response3.body.message).toBe(
      "There is an active rental for this movie"
    );

    await testBase.resetDatabase(db);

    const upcomingMovie = await authenticatedSession
      .get(`/api/movie/${upcomingMovieId}`)
      .set("Authorization", `Bearer ${authToken}`);

    const response4 = await authenticatedSession
      .post("/api/rental/")
      .send({
        movieId: upcomingMovieId,
        daysRented: 1,
      })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response4.status).toBe(HttpStatus.CREATED);
    expect(response4.body.data.movieId).toBe(upcomingMovieId);
    expect(response4.body.data.rentalFee).toBe(upcomingMovie.body.data.dailyRentalRate);
    expect(response4.body.data.rentedAt).toBe(upcomingMovie.body.data.releaseAt);
    
  });
});
