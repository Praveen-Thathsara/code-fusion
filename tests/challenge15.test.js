import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";

var testSession = null;
const movieId = "2d3e6418-34eb-4753-aae4-b45eb78acbed";
let giftedRental;

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
  var authUserId = null;
  beforeAll(async () => {
    const result = await testBase.authenticateTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
    authUserId = result.userId;
  });

  test("Challenge 15.a - Gift a rental", async () => {
    //gift a rental without enough balance
    const res = await authenticatedSession
      .post(`/api/rental/gift`)
      .send({
        receiverEmail: "lebronJ@gmail.com",
        movieId: movieId,
        daysRented: 3,
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toEqual(400);
    expect(res.body.message).toBe("Insufficient balance");

    //get users's balance
    const authUser1 = await authenticatedSession
      .get(`/api/user/${authUserId}`)
      .set("Authorization", `Bearer ${authToken}`);
    let balance = authUser1.body.data.balance;

    //get movie's daily rate
    const movie1 = await authenticatedSession
      .get(`/api/movie/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);
    let dailyRate = movie1.body.data.dailyRentalRate;

    //gift a rental with enough balance
    const res2 = await authenticatedSession
      .post(`/api/rental/gift`)
      .send({
        receiverEmail: "lebronJ@gmail.com",
        movieId: movieId,
        daysRented: 1,
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res2.status).toEqual(201);
    giftedRental = res2.body.data;

    //check if the balance has been deducted
    const authUser2 = await authenticatedSession
      .get(`/api/user/${authUserId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(authUser2.body.data.balance).toEqual(balance - dailyRate);

    //gift a rental for an already rented movie with active rental.
    const res3 = await authenticatedSession
      .post(`/api/rental/gift`)
      .send({
        receiverEmail: "lebronJ@gmail.com",
        movieId: movieId,
        daysRented: 1,
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res3.status).toEqual(200);
    giftedRental.rentalFee = 200;
    giftedRental.daysRented = 2;
    expect(res3.body.data).toEqual(giftedRental);
  });
});
