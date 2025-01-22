import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";

var testSession = null;

const initialFeedback = {
  userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
  movieId: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
  rating: 5,
  comment:
    "Great movie! I loved it! The plot was amazing and the acting was superb!",
  createdAt: "2024-03-06T11:30:00.000Z",
};

const modifiedFeedback = {
  userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
  movieId: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
  rating: 4,
  comment:
    "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
  createdAt: "",
};

const newRentalResponse = {
  id: "b0fe0ebf-e799-4fdc-b12e-943d36b0680b",
  userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
  movieId: "a742a595-e707-458a-9240-66742251dabf",
  rentalFee: 200,
  daysRented: 2,
  rentedAt: "",
};

const newRentalFeedback = {
  userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
  movieId: "a742a595-e707-458a-9240-66742251dabf",
  rating: 5,
  comment:
    "Great movie! I loved it! The plot was amazing and the acting was superb!",
  createdAt: "",
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
  var authenticatedUserId = null;
  var authToken = null;
  beforeAll(async () => {
    const result = await testBase.authenticateTestSession(testSession);
    authenticatedSession = testSession;
    authenticatedUserId = result.userId;
    authToken = result.token;
  });

  test("Challenge 8.a - add feedback to a newly rented movie", async () => {
    const movieId = "a742a595-e707-458a-9240-66742251dabf";
    let newRental = {
      movieId: movieId,
      daysRented: 2,
    };

    let newFeedback = {
      movieId: movieId,
      rating: 5,
      comment:
        "Great movie! I loved it! The plot was amazing and the acting was superb!",
    };

    const res = await authenticatedSession
      .post(`/api/rental/`)
      .send(newRental)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(201);
    newRentalResponse.id = res.body.data.id;
    newRentalResponse.rentedAt = res.body.data.rentedAt;
    expect(res.body.data).toEqual(newRentalResponse);

    const res1 = await authenticatedSession
      .post(`/api/feedback/`)
      .send(newFeedback)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res1.status).toBe(201);
    newRentalFeedback.createdAt = res1.body.data.createdAt;

    const res2 = await authenticatedSession
      .get(`/api/feedback/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res2.status).toBe(200);
    expect(res2.body.data).toEqual(newRentalFeedback);
  });

  test("Challenge 8.b - update feedback", async () => {
    const movieId = "b5f37e47-40a7-4688-b6aa-420356eabcf8";
    let newFeedback = {
      userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      movieId: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
      rating: 4,
      comment:
        "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
      createdAt: "",
    };

    const res = await authenticatedSession
      .get(`/api/feedback/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(initialFeedback);

    const res1 = await authenticatedSession
      .post(`/api/feedback/`)
      .send(newFeedback)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res1.status).toBe(200);
    modifiedFeedback.createdAt = res1.body.data.createdAt;

    const res2 = await authenticatedSession
      .get(`/api/feedback/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res2.status).toBe(200);
    expect(res2.body.data).toEqual(modifiedFeedback);
  });
});
