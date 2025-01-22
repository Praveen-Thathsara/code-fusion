import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";

let testSession = null;
let testAdminSession = null;

const upcomingMovieData = [
  {
    id: "e3d0cd0e-4150-4118-a227-329dfae69d9f",
    title: "Dune part 2",
    year: 2024,
    dailyRentalRate: 127.5,
    discountRate: 0.15,
    genres: ["Adventure", "Action"],
    userRating: 0,
    imdbRating: 8.2,
    posterUrl:
      "https://image.tmdb.org/t/p/original/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
    bannerUrl:
      "https://assets-prd.ignimgs.com/2023/12/03/dune-1701627712924.jpg",
    plot: 'Dune: Part Two" continues the epic saga of Paul Atreides as he navigates the treacherous politics and power struggles of the desert planet Arrakis. As Paul embraces his destiny as the messiah of the Fremen people, he must confront the forces of the Empire and the malevolent Baron Harkonnen in a battle for control of the most valuable substance in the universe: the spice melange. With its stunning visuals, intricate world-building, and compelling characters, "Dune: Part Two" is a mesmerizing and thought-provoking exploration of power, destiny, and the human spirit.',
    runtime: "2h 35m",
    directedBy: "Denis Villeneuve",
    starring: "Timothée Chalamet,Rebecca Ferguson,Jason Momoa",
    releaseAt: "2025-09-20T00:00:00.000Z",
    isDeleted: 0,
  },
];

const nextMoviesData = {
  nextMovies: [
    {
      id: "b9b3d2c3-4b2e-4a7e-8b5d-1f4c6e4c4e5f",
      title: "The Lord of the Rings: The Fellowship of the Ring",
      year: 2001,
      dailyRentalRate: 150.0,
      discountRate: 0.15,
      genres: ["Action", "Thriller", "Fantasy"],
      imdbRating: 8.8,
      posterUrl:
        "https://posters.movieposterdb.com/11_12/2001/120737/l_120737_1b4b2e7d.jpg",
      bannerUrl: "https://picfiles.alphacoders.com/102/102644.jpg",
      plot: "The Lord of the Rings: The Fellowship of the Ring follows the story of Frodo Baggins, a young hobbit who is entrusted with a powerful ring that could bring about the end of the world.",
      runtime: "2h 58m",
      directedBy: "Peter Jackson",
      starring: "Elijah Wood,Ian McKellen,Orlando Bloom",
      releaseAt: "2024-06-20T00:00:00.000Z",
      isDeleted: false,
    },
    {
      id: "f6d2f9c1-3b6f-4e7c-9d2c-9e8f0e9b1d2e",
      title: "The Lord of the Rings: The Two Towers",
      year: 2002,
      dailyRentalRate: 150.0,
      discountRate: 0.15,
      genres: ["Action", "Thriller", "Mystery"],
      imdbRating: 8.7,
      posterUrl:
        "https://posters.movieposterdb.com/11_12/2002/120737/l_120737_1b4b2e7d.jpg",
      bannerUrl: "https://picfiles.alphacoders.com/102/102644.jpg",
      plot: "The Lord of the Rings: The Two Towers continues the epic saga of Frodo Baggins and the fellowship as they face new challenges and dangers in their quest to destroy the One Ring.",
      runtime: "2h 59m",
      directedBy: "Peter Jackson",
      starring: "Elijah Wood,Ian McKellen,Viggo Mortensen",
      releaseAt: "2024-07-20T00:00:00.000Z",
      isDeleted: false,
    },
  ],
};

const nextBestMovie = {
  bannerUrl: "https://picfiles.alphacoders.com/102/102644.jpg",
  dailyRentalRate: 150,
  directedBy: "Peter Jackson",
  discountRate: 0,
  genres: ["Action", "Thriller", "Fantasy"],
  imdbRating: 8.8,
  plot: "The Lord of the Rings: The Fellowship of the Ring follows the story of Frodo Baggins, a young hobbit who is entrusted with a powerful ring that could bring about the end of the world.",
  posterUrl:
    "https://posters.movieposterdb.com/11_12/2001/120737/l_120737_1b4b2e7d.jpg",
  releaseAt: "2024-06-20T00:00:00.000Z",
  runtime: "2h 58m",
  starring: "Elijah Wood,Ian McKellen,Orlando Bloom",
  title: "The Lord of the Rings: The Fellowship of the Ring",
  userRating: 0,
  year: 2001,
};

/**
 * Create a super test session and initiate the database before running tests.
 */
beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  testAdminSession = testBase.createSuperTestSession(app);
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
    const result = await testBase.authenticateTestSession(testSession);
    authenticatedSession = testSession;
    authToken = result.token;
  });

  test("Challenge 12.a - Get upcoming movies", async () => {
    const res = await authenticatedSession
      .get("/api/movie/upcoming")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(upcomingMovieData);
  });

  test("Challenge 12.b  - Get next best movie by user", async () => {
    const res = await authenticatedSession
      .post("/api/movie/bestRevenued")
      .send(nextMoviesData)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toEqual("Access denied!");
  });
});

describe("Post admin authentication tasks", () => {
  let authenticatedAdminSession = null;
  let authAdminToken = null;
  beforeAll(async () => {
    const resultAdmin = await testBase.authenticateAdminTestSession(
      testAdminSession
    );
    authenticatedAdminSession = testAdminSession;
    authAdminToken = resultAdmin.token;
  });
});
