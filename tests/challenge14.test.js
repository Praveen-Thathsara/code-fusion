import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";

var testSession = null;
const movieId = "b5f37e47-40a7-4688-b6aa-420356eabcf8";
const deletableMovieId = "91ff065e-e390-4721-8b0e-1b3da38f5945";
const notDeletedMovie = {
  "id": "b5f37e47-40a7-4688-b6aa-420356eabcf8",
  "title": "The shawshank redemption",
  "year": 1994,
  "dailyRentalRate": 100,
  "discountRate": 0,
  "genres": [
      "Romance",
      "Adventure",
      "Drama"
  ],
  "userRating": 4,
  "imdbRating": 9.3,
  "posterUrl": "https://posters.movieposterdb.com/05_02/1994/0111161/l_7266_0111161_d2436dce.jpg",
  "bannerUrl": "https://m.media-amazon.com/images/I/71MpMh9upxL._AC_UF894,1000_QL80_.jpg",
  "plot": "\"The Shawshank Redemption\" tells the story of Andy Dufresne, a banker who is wrongfully convicted of murder and sentenced to life in Shawshank State Penitentiary, where he forms a friendship with fellow inmate Red and ultimately engineers a daring escape over the course of two decades, all while maintaining his innocence. Through perseverance, hope, and resilience, Andy triumphs over adversity and finds redemption on the outside.",
  "runtime": "2h 22m",
  "directedBy": "Frank Darabont",
  "starring": "Tim Robbins,Morgan Freeman",
  "releaseAt": "2022-04-14T00:00:00.000Z",
  "isDeleted": 0
};
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

  test("Challenge 14.a - Delete a movie that does not meet the conditions, then delete a movie that does meet the conditions", async () => {
    const res = await authenticatedSession
      .delete(`/api/movie/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toEqual(400);

    const res1 = await authenticatedSession
      .get(`/api/movie/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res1.status).toEqual(200);
    expect(res1.body.data).toEqual(notDeletedMovie);

    const res2 = await authenticatedSession
      .delete(`/api/movie/${deletableMovieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res2.status).toEqual(200);

    const res3 = await authenticatedSession
      .get(`/api/movie/${deletableMovieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res3.status).toEqual(404);
    expect(res3.body.message).toBe("Movie not found");
  });
});
