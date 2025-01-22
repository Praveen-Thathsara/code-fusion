import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";

var testSession = null;

const expectedResponse = [
  {
    "id": "e09ab8f1-bbd9-4066-a287-f31a54c2aef5",
    "title": "The Godfather: Part II",
    "year": 1974,
    "dailyRentalRate": 150,
    "discountRate": 0,
    "genres": [
      "Thriller",
      "Action",
      "Drama"
    ],
    "userRating": 4,
    "imdbRating": 9,
    "posterUrl": "https://posters.movieposterdb.com/22_07/1974/71562/l_71562_28dbaac1.jpg",
    "bannerUrl": "https://wallpapercave.com/wp/wp4119161.jpg",
    "plot": "The Godfather: Part II\" continues the saga of the Corleone family, exploring the rise of a young Vito Corleone as he builds his criminal empire and the reign of his son, Michael, as he seeks to expand the family's influence and protect their legacy. As the story unfolds, the film delves into themes of power, corruption, and the consequences of violence, offering a compelling and complex portrait of the American dream and the cost of pursuing it.",
    "runtime": "3h 22m",
    "directedBy": "Francis Ford Coppola",
    "starring": "AI Pacino,Robert De Niro,Robert Duvall",
    "releaseAt": "2023-03-29T00:00:00.000Z",
    "isDeleted": 0
  },
  {
    "id": "b349436c-a26a-4959-99af-7a1d9c4088fc",
    "title": "The Dark Knight",
    "year": 2008,
    "dailyRentalRate": 125,
    "discountRate": 0,
    "genres": [
      "Crime",
      "Adventure",
      "Action"
    ],
    "userRating": 3.7,
    "imdbRating": 9,
    "posterUrl": "https://posters.movieposterdb.com/08_05/2008/468569/l_468569_f0e2cd63.jpg",
    "bannerUrl": "https://eskipaper.com/images/the-dark-knight-4.jpg",
    "plot": "\"The Dark Knight\" follows the story of Batman as he faces off against the Joker, a sadistic criminal mastermind who seeks to undermine Gotham City's sense of justice and morality. As the Joker's reign of terror threatens to destroy the city, Batman must confront his own inner demons and make sacrifices to protect the people he loves. With its complex characters, intense action, and thought-provoking themes, \"The Dark Knight\" is a gripping exploration of heroism, villainy, and the blurred lines between them.",
    "runtime": "2h 32m",
    "directedBy": "Christopher Nolan",
    "starring": "Christian Bale,Heath Ledger,Aaron Eckhart",
    "releaseAt": "2023-04-29T00:00:00.000Z",
    "isDeleted": 0
  },
  {
    "id": "a742a595-e707-458a-9240-66742251dabf",
    "title": "Spider Man 1",
    "year": 2002,
    "dailyRentalRate": 100,
    "discountRate": 0,
    "genres": [
      "Romance",
      "Adventure",
      "Action"
    ],
    "userRating": 4,
    "imdbRating": 7.3,
    "posterUrl": "https://posters.movieposterdb.com/08_10/2002/145487/l_145487_821ea90e.jpg",
    "bannerUrl": "https://i.pinimg.com/originals/74/6d/79/746d79553f55de04e8f9560cb35d2e41.jpg",
    "plot": "Peter Parker, a shy high school student, is often bullied by his classmates. However, his life changes when he is bitten by a genetically altered spider and gains superpowers. He must now use his newfound abilities to fight the evil Green Goblin and save the city.",
    "runtime": "2h 1m",
    "directedBy": "Sam Raimi",
    "starring": "Tobey Maguire,Kirsten Dunst,Willem Dafoe",
    "releaseAt": "2023-08-25:00:00.000Z",
    "isDeleted": 0
  },
  {
    "id": "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
    "title": "The Godfather",
    "year": 1972,
    "dailyRentalRate": 150,
    "discountRate": 0,
    "genres": [
      "Thriller",
      "Action",
      "Drama"
    ],
    "userRating": 3,
    "imdbRating": 9.2,
    "posterUrl": "https://posters.movieposterdb.com/22_07/1972/68646/l_68646_8c811dec.jpg",
    "bannerUrl": "https://c4.wallpaperflare.com/wallpaper/874/376/908/the-godfather-movies-vito-corleone-wallpaper-preview.jpg",
    "plot": "\"The Godfather\" follows the story of the powerful Italian-American crime family, the Corleones, led by Don Vito Corleone. When the aging Don is nearly assassinated, his reluctant son, Michael, is drawn into the world of organized crime and eventually rises to power, navigating betrayal, loyalty, and vengeance in a ruthless quest to protect his family's legacy.",
    "runtime": "2h 55m",
    "directedBy": "Francis Ford Coppola",
    "starring": "AI Pacino,Marion Brando,James Caan",
    "releaseAt": "2022-05-14T00:00:00.000Z",
    "isDeleted": 0
  }
];
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

  test("Challenge 6.a - Get suggested movies for given user id", async () => {
    const res = await authenticatedSession
      .get("/api/movie/suggestions")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(expectedResponse);
  });
});
