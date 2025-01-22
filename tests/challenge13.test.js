import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";

import testBase from "./testBase.js";
import app from "../src/server.js";
import db from "../db/db-config.js";
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
  let authenticatedSession = null;
  let authToken = null;

  beforeAll(async () => {
    const result = await testBase.authenticateAdminTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
  });

  test("Challenge 13.a - Group users using k-means clustering", async () => {
    const expectedResponse = {
      centroids: [
        [131.25, 1.25],
        [691.6666666666666, 5.666666666666667],
        [1333.3333333333333, 11.333333333333334],
      ],
      assignment: [
        {
          user: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
          group: "Gold Renters ",
        },
        {
          user: "da9347a6-2a7f-4573-be27-15f05569fb0d",
          group: "Gold Renters ",
        },
        {
          user: "fce17e94-3415-4c08-b2c9-beddba191b4d",
          group: "Silver Renters",
        },
        {
          user: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
          group: "Gold Renters ",
        },
        {
          user: "999da33d-74c3-4176-bb26-98c53215a71c",
          group: "Silver Renters",
        },
        {
          user: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
          group: "Bronze Renters",
        },
        {
          user: "1ebd273d-9b35-4f9f-a96e-6e0c09194d1f",
          group: "Bronze Renters",
        },
        {
          user: "52ef9366-6e86-4498-be32-a33087d03670",
          group: "Bronze Renters",
        },
        {
          user: "7dfcf073-99b9-4ed0-9458-600484a2e265",
          group: "Bronze Renters",
        },
        {
          user: "fe1f120c-85a1-4d83-9ebd-ef993951c51c",
          group: "Silver Renters",
        },
      ],
    };

    const response = await authenticatedSession
      .get("/api/user/groups")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toEqual(expectedResponse);
  });
});
