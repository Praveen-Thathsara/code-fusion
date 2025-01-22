/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("feedback").del();
  await knex("feedback").insert([
    {
      user_id: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      movie_id: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
      rating: 5.0,
      comment:
        "Great movie! I loved it! The plot was amazing and the acting was superb!",
      created_at: "2024-03-06T11:30:00.000Z",
    },
    {
      user_id: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      rating: 1.0,
      comment:
        "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible!",
      created_at: "2024-03-07T04:30:00.000Z",
    },
    {
      user_id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      movie_id: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
      rating: 3.0,
      comment:
        "Average movie! The plot was ok and the acting was average! I would not watch it again!",
      created_at: "2024-03-07T11:30:00.000Z",
    },
    {
      user_id: "fce17e94-3415-4c08-b2c9-beddba191b4d",
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      rating: 4.0,
      comment:
        "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
      created_at: "2024-03-08T04:30:00.000Z",
    },
    {
      user_id: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
      movie_id: "b349436c-a26a-4959-99af-7a1d9c4088fc",
      rating: 5.0,
      comment:
        "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-08T11:30:00.000Z",
    },
    {
      user_id: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      rating: 2.0,
      comment:
        "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
      created_at: "2024-03-09T04:30:00.000Z",
    },
    {
      user_id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      movie_id: "e09ab8f1-bbd9-4066-a287-f31a54c2aef5",
      rating: 5.0,
      comment:
        "One of the best movies I have ever seen! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-09T11:30:00.000Z",
    },
    {
      user_id: "fce17e94-3415-4c08-b2c9-beddba191b4d",
      movie_id: "a742a595-e707-458a-9240-66742251dabf",
      rating: 3.0,
      comment:
        "Overall a good movie! The plot was ok and the acting was average! I would not watch it again!",
      created_at: "2024-03-10T04:30:00.000Z",
    },
    {
      user_id: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
      movie_id: "a742a595-e707-458a-9240-66742251dabf",
      rating: 5.0,
      comment:
        "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-10T11:30:00.000Z",
    },
    {
      user_id: "999da33d-74c3-4176-bb26-98c53215a71c",
      movie_id: "b349436c-a26a-4959-99af-7a1d9c4088fc",
      rating: 4.0,
      comment:
        "can recommend this movie! The plot was intriguing and the acting was good! I would watch it again!",
      created_at: "2024-03-11T04:30:00.000Z",
    },
    {
      user_id: "999da33d-74c3-4176-bb26-98c53215a71c",
      movie_id: "ad41b6f6-d79f-4e58-89d6-9bb53498ccd9",
      rating: 5.0,
      comment:
        "One of the best movies I have ever seen! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-11T11:30:00.000Z",
    },
    {
      user_id: "999da33d-74c3-4176-bb26-98c53215a71c",
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      rating: 5.0,
      comment:
        "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-12T04:30:00.000Z",
    },
    {
      user_id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      rating: 3.0,
      comment:
        "Average movie! The plot was ok and the acting was average! I would not watch it again!",
      created_at: "2024-03-12T11:30:00.000Z",
    },
    {
      user_id: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      movie_id: "284db811-12a5-4cc9-b51b-fd5a0468ce6e",
      rating: 4.0,
      comment:
        "can recommend this movie! The plot was intriguing and the acting was good! I would watch it again!",
      created_at: "2024-03-13T04:30:00.000Z",
    },
    {
      user_id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      movie_id: "284db811-12a5-4cc9-b51b-fd5a0468ce6e",
      rating: 3.0,
      comment:
        "Overall a good movie! The plot was ok and the acting was average! I would not watch it again!",
      created_at: "2024-03-13T11:30:00.000Z",
    },
    {
      user_id: "fce17e94-3415-4c08-b2c9-beddba191b4d",
      movie_id: "2d3e6418-34eb-4753-aae4-b45eb78acbed",
      rating: 5.0,
      comment:
        "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-14T04:30:00.000Z",
    },
    {
      user_id: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
      movie_id: "2d3e6418-34eb-4753-aae4-b45eb78acbed",
      rating: 3.0,
      comment:
        "Overall a good movie! The plot was ok and the acting was average! I would not watch it again!",
      created_at: "2024-03-14T11:30:00.000Z",
    },
    {
      user_id: "999da33d-74c3-4176-bb26-98c53215a71c",
      movie_id: "f800a874-d19f-40e4-80af-778188705a44",
      rating: 5.0,
      comment:
        "One of the best movies I have ever seen! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-03-15T04:30:00.000Z",
    },
    {
      user_id: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      movie_id: "f800a874-d19f-40e4-80af-778188705a44",
      rating: 3.0,
      comment:
        "Overall a good movie! The plot was ok and the acting was average! I would not watch it again!",
      created_at: "2024-03-15T11:30:00.000Z",
    },
    {
      user_id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      movie_id: "a742a595-e707-458a-9240-66742251dabf",
      rating: 4.0,
      comment: "Fun to watch",
      created_at: "2024-04-04T06:25:43.135Z",
    },
    {
      user_id: "fce17e94-3415-4c08-b2c9-beddba191b4d",
      movie_id: "b349436c-a26a-4959-99af-7a1d9c4088fc",
      rating: 2.0,
      comment:
        "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
      created_at: "2024-04-04T09:38:20.556Z",
    },
    {
      user_id: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      movie_id: "2d3e6418-34eb-4753-aae4-b45eb78acbed",
      rating: 5.0,
      comment:
        "Best movie ever! The plot was amazing and the acting was superb! I would watch it again and again!",
      created_at: "2024-04-04T09:56:07.982Z",
    },
    {
      user_id: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      movie_id: "ad41b6f6-d79f-4e58-89d6-9bb53498ccd9",
      rating: 4.0,
      comment:
        "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
      created_at: "2024-04-04T09:59:49.295Z",
    },
    {
      user_id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      movie_id: "ad41b6f6-d79f-4e58-89d6-9bb53498ccd9",
      rating: 2.0,
      comment:
        "Terrible movie! Did not like it at all! The plot was boring and the acting was terrible! I would not watch it again!",
      created_at: "2024-04-04T10:01:24.761Z",
    },
    {
      user_id: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
      movie_id: "e09ab8f1-bbd9-4066-a287-f31a54c2aef5",
      rating: 3.0,
      comment:
        "Interesting movie! The plot was intriguing and the acting was good! I would watch it again!",
      created_at: "2024-04-05T04:28:07.352Z",
    },
  ]);
}
