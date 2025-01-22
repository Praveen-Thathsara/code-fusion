import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import auth from "../src/middleware/auth.js";
import HttpStatus from "../src/enums/httpStatus.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import app from "../src/server.js";

const app1 = express();
app1.use(express.json());
app1.use("/protected", auth, (req, res) =>
  res.status(200).send("Protected content")
);

describe("Pre authentication tasks", () => {
  test("Challenge 2.a - Test auth middleware", async () => {
    const res = await request(app1).get("/protected");
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.text).toBe("Access denied! No token provided");

    const res1 = await request(app1)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");
    expect(res1.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res1.text).toBe("Invalid token");
  });
});

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
    const result = await testBase.authenticateTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
  });

  test("Challenge 2.b - Testing admin authorization for none admin user", async () => {
    //User Routes
    const res = await authenticatedSession
      .get(`/api/user`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(HttpStatus.FORBIDDEN);
    expect(res.body.message).toBe("Access denied!");

    const res1 = await authenticatedSession
      .delete(`/api/user/:id`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res1.status).toBe(HttpStatus.FORBIDDEN);
    expect(res1.body.message).toBe("Access denied!");

    //Movie Routes
    const res2 = await authenticatedSession
      .post(`/api/movie/`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res2.status).toBe(HttpStatus.FORBIDDEN);
    expect(res2.body.message).toBe("Access denied!");

    const res3 = await authenticatedSession
      .post(`/api/movie/`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res3.status).toBe(HttpStatus.FORBIDDEN);
    expect(res3.body.message).toBe("Access denied!");

    const res4 = await authenticatedSession
      .delete(`/api/movie/:id`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res4.status).toBe(HttpStatus.FORBIDDEN);
    expect(res4.body.message).toBe("Access denied!");

    //Genre Routes
    const res5 = await authenticatedSession
      .post(`/api/genre/`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res5.status).toBe(HttpStatus.FORBIDDEN);
    expect(res5.body.message).toBe("Access denied!");

    const res6 = await authenticatedSession
      .put(`/api/genre/:id`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res6.status).toBe(HttpStatus.FORBIDDEN);
    expect(res6.body.message).toBe("Access denied!");

    const res7 = await authenticatedSession
      .delete(`/api/genre/:id`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res7.status).toBe(HttpStatus.FORBIDDEN);
    expect(res7.body.message).toBe("Access denied!");
  });
});

