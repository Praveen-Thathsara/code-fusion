import { beforeAll, afterAll, test, describe, expect } from "vitest";
import app from "../src/server.js";
import db from "../db/db-config.js";
import HttpStatus from "../src/enums/httpStatus.js";
import testBase from "./testBase";
var testSession = null;


beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  await testBase.resetDatabase(db);
});

/**
 * Take down the app once test execution is done
 */
afterAll(async (done) => {
  app.close(done);
});

describe("Post authentication tasks", () => {
  let authenticatedSession = null;
  let authToken = null;
  function modifyExpectedFeedback(expectedResponse) {
    expectedResponse.map((item) => {
      if (item.createdAt !== "Today") {
        item.createdAt =
          Math.floor((new Date() - new Date(item.createdAt)) / 86400000) +
          " days ago";
      }
    });
  }

  beforeAll(async () => {
    const result = await testBase.authenticateTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
  });

  const movieId = "6ba1472e-563c-4dbd-ad31-d78aec32f5af";

  test("Challenge 9.a - get all feedback for a movie", async () => {
    const expectedResponse = [
      {
        name: "Denzel Washington",
        userId: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
        rating: 1,
        comment: "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible!",
        createdAt: "2024-03-07T04:30:00.000Z"
      },
      {
        name: "Ben Affleck",
        userId: "fce17e94-3415-4c08-b2c9-beddba191b4d",
        rating: 4,
        comment: "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
        createdAt: "2024-03-08T04:30:00.000Z"
      },
      {
        name: "Tom Cruise",
        userId: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
        rating: 2,
        comment: "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
        createdAt: "2024-03-09T04:30:00.000Z"
      },
      {
        name: "Will Smith",
        userId: "999da33d-74c3-4176-bb26-98c53215a71c",
        rating: 5,
        comment: "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
        createdAt: "2024-03-12T04:30:00.000Z"
      },
      {
        name: "Matt Damon",
        userId: "da9347a6-2a7f-4573-be27-15f05569fb0d",
        rating: 3,
        comment: "Average movie! The plot was ok and the acting was average! I would not watch it again!",
        createdAt: "2024-03-12T11:30:00.000Z"
      },
      {
        name: "John Smith",
        userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
        rating: 5,
        comment: "Fun to watch",
        createdAt: "Today",
      }
    ]

    modifyExpectedFeedback(expectedResponse);

    const response = await authenticatedSession
      .get(`/api/feedback/movie/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toEqual(expectedResponse);
  });

  test("Challenge 9.b - show top 2 and bottom 2 feedbacks for a movie", async () => {
    const expectedResponse = [
      {
        name: "Denzel Washington",
        userId: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
        rating: 1,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible!",
        createdAt: "2024-03-07T04:30:00.000Z",
      },
      {
        name: "Tom Cruise",
        userId: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
        rating: 2,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
        createdAt: "2024-03-09T04:30:00.000Z",
      },
      {
        name: "Will Smith",
        userId: "999da33d-74c3-4176-bb26-98c53215a71c",
        rating: 5,
        comment:
          "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
        createdAt: "2024-03-12T04:30:00.000Z",
      },
      {
        name: "John Smith",
        userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
        rating: 5,
        comment: "Fun to watch",
        createdAt: "Today",
      },
    ];

    modifyExpectedFeedback(expectedResponse);

    const response = await authenticatedSession
      .get(`/api/feedback/movie/topBottom/${movieId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data.length).toBe(4);
    expect(response.body.data).toEqual(expectedResponse);
  });

  const getFeedbackData = async (option, order) => {
    try {
      const response = await authenticatedSession
        .get(`/api/feedback/movie/sort/${movieId}/?option=${option}&order=${order}`)
        .set("Authorization", `Bearer ${authToken}`);
      const data = response.body.data;
      const status = response.status;
      return { data, status };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  test("Challenge 9.c -  Sort feedbacks", async () => {
    const expectedResponse1 = [
      {
        name: "John Smith",
        userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
        rating: 5,
        comment: "Fun to watch",
        createdAt: "Today",
      },
      {
        name: "Matt Damon",
        userId: "da9347a6-2a7f-4573-be27-15f05569fb0d",
        rating: 3,
        comment:
          "Average movie! The plot was ok and the acting was average! I would not watch it again!",
        createdAt: "2024-03-12T11:30:00.000Z",
      },
      {
        name: "Will Smith",
        userId: "999da33d-74c3-4176-bb26-98c53215a71c",
        rating: 5,
        comment:
          "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
        createdAt: "2024-03-12T04:30:00.000Z",
      },
      {
        name: "Tom Cruise",
        userId: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
        rating: 2,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
        createdAt: "2024-03-09T04:30:00.000Z",
      },
    ];
    modifyExpectedFeedback(expectedResponse1);

    const response1 = await getFeedbackData("time", "desc");
    expect(response1.status).toBe(HttpStatus.OK);
    expect(response1.data).toEqual(expectedResponse1);

    const expectedResponse2 = [
      {
        name: "Denzel Washington",
        userId: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
        rating: 1,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible!",
        createdAt: "2024-03-07T04:30:00.000Z",
      },
      {
        name: "Ben Affleck",
        userId: "fce17e94-3415-4c08-b2c9-beddba191b4d",
        rating: 4,
        comment:
          "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
        createdAt: "2024-03-08T04:30:00.000Z",
      },
      {
        name: "Tom Cruise",
        userId: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
        rating: 2,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
        createdAt: "2024-03-09T04:30:00.000Z",
      },
      {
        name: "Will Smith",
        userId: "999da33d-74c3-4176-bb26-98c53215a71c",
        rating: 5,
        comment:
          "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
        createdAt: "2024-03-12T04:30:00.000Z",
      },
    ];

    modifyExpectedFeedback(expectedResponse2);

    const response2 = await getFeedbackData("time", "asc");
    expect(response2.status).toBe(HttpStatus.OK);
    expect(response2.data).toEqual(expectedResponse2);

    const expectedResponse3 = [
      {
        name: "Will Smith",
        userId: "999da33d-74c3-4176-bb26-98c53215a71c",
        rating: 5,
        comment:
          "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
        createdAt: "2024-03-12T04:30:00.000Z",
      },
      {
        name: "John Smith",
        userId: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
        rating: 5,
        comment: "Fun to watch",
        createdAt: "Today",
      },
      {
        name: "Ben Affleck",
        userId: "fce17e94-3415-4c08-b2c9-beddba191b4d",
        rating: 4,
        comment:
          "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
        createdAt: "2024-03-08T04:30:00.000Z",
      },
      {
        name: "Matt Damon",
        userId: "da9347a6-2a7f-4573-be27-15f05569fb0d",
        rating: 3,
        comment:
          "Average movie! The plot was ok and the acting was average! I would not watch it again!",
        createdAt: "2024-03-12T11:30:00.000Z",
      },
    ];

    modifyExpectedFeedback(expectedResponse3);

    const response3 = await getFeedbackData("rating", "desc");
    expect(response3.status).toBe(HttpStatus.OK);
    expect(response3.data).toEqual(expectedResponse3);

    const expectedResponse4 = [
      {
        name: "Denzel Washington",
        userId: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
        rating: 1,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible!",
        createdAt: "2024-03-07T04:30:00.000Z",
      },
      {
        name: "Tom Cruise",
        userId: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
        rating: 2,
        comment:
          "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
        createdAt: "2024-03-09T04:30:00.000Z",
      },
      {
        name: "Matt Damon",
        userId: "da9347a6-2a7f-4573-be27-15f05569fb0d",
        rating: 3,
        comment:
          "Average movie! The plot was ok and the acting was average! I would not watch it again!",
        createdAt: "2024-03-12T11:30:00.000Z",
      },
      {
        name: "Ben Affleck",
        userId: "fce17e94-3415-4c08-b2c9-beddba191b4d",
        rating: 4,
        comment:
          "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
        createdAt: "2024-03-08T04:30:00.000Z",
      },
    ];

    modifyExpectedFeedback(expectedResponse4);

    const response4 = await getFeedbackData("rating", "asc");
    expect(response4.status).toBe(HttpStatus.OK);
    expect(response4.data).toEqual(expectedResponse4);
  });
});
