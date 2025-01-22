/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("movie_genre").del();
  await knex("movie_genre").insert([
    {
      movie_id: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
      genre_id: "be3046f9-2975-4bd3-8edf-2f42be4532f0",
    },
    {
      movie_id: "b5f37e47-40a7-4688-b6aa-420356eabcf8",
      genre_id: "2ca9f2c6-e473-431c-ae20-16069deed6ce",
    },
    {
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      genre_id: "85ea1bd9-fc89-4d16-99a9-59d00e6fd212",
    },
    {
      movie_id: "6ba1472e-563c-4dbd-ad31-d78aec32f5af",
      genre_id: "be3046f9-2975-4bd3-8edf-2f42be4532f0",
    },
    {
      movie_id: "e09ab8f1-bbd9-4066-a287-f31a54c2aef5",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "e09ab8f1-bbd9-4066-a287-f31a54c2aef5",
      genre_id: "85ea1bd9-fc89-4d16-99a9-59d00e6fd212",
    },
    {
      movie_id: "e09ab8f1-bbd9-4066-a287-f31a54c2aef5",
      genre_id: "be3046f9-2975-4bd3-8edf-2f42be4532f0",
    },
    {
      movie_id: "b349436c-a26a-4959-99af-7a1d9c4088fc",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "b349436c-a26a-4959-99af-7a1d9c4088fc",
      genre_id: "23a0adc3-b180-4902-b2a5-124ed9f8ee7c",
    },
    {
      movie_id: "b349436c-a26a-4959-99af-7a1d9c4088fc",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "ad41b6f6-d79f-4e58-89d6-9bb53498ccd9",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "ad41b6f6-d79f-4e58-89d6-9bb53498ccd9",
      genre_id: "23a0adc3-b180-4902-b2a5-124ed9f8ee7c",
    },
    {
      movie_id: "ad41b6f6-d79f-4e58-89d6-9bb53498ccd9",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "a742a595-e707-458a-9240-66742251dabf",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "a742a595-e707-458a-9240-66742251dabf",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "a742a595-e707-458a-9240-66742251dabf",
      genre_id: "2ca9f2c6-e473-431c-ae20-16069deed6ce",
    },
    {
      movie_id: "284db811-12a5-4cc9-b51b-fd5a0468ce6e",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "284db811-12a5-4cc9-b51b-fd5a0468ce6e",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "284db811-12a5-4cc9-b51b-fd5a0468ce6e",
      genre_id: "2ca9f2c6-e473-431c-ae20-16069deed6ce",
    },
    {
      movie_id: "2d3e6418-34eb-4753-aae4-b45eb78acbed",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "2d3e6418-34eb-4753-aae4-b45eb78acbed",
      genre_id: "ba1de4bf-95ba-4fac-9844-37b7359178d5",
    },
    {
      movie_id: "2d3e6418-34eb-4753-aae4-b45eb78acbed",
      genre_id: "d02b3f2f-f659-488f-90fa-b2452151c7ba",
    },
    {
      movie_id: "f800a874-d19f-40e4-80af-778188705a44",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "f800a874-d19f-40e4-80af-778188705a44",
      genre_id: "ba1de4bf-95ba-4fac-9844-37b7359178d5",
    },
    {
      movie_id: "f800a874-d19f-40e4-80af-778188705a44",
      genre_id: "d02b3f2f-f659-488f-90fa-b2452151c7ba",
    },
    {
      movie_id: "e6f46ab0-67a4-4126-9b30-b8647a5e2856",
      genre_id: "ba1de4bf-95ba-4fac-9844-37b7359178d5",
    },
    {
      movie_id: "e6f46ab0-67a4-4126-9b30-b8647a5e2856",
      genre_id: "d02b3f2f-f659-488f-90fa-b2452151c7ba",
    },
    {
      movie_id: "e6f46ab0-67a4-4126-9b30-b8647a5e2856",
      genre_id: "85ea1bd9-fc89-4d16-99a9-59d00e6fd212",
    },
    {
      movie_id: "47ef0a76-fbed-4d6f-bdd5-55ffc6506c03",
      genre_id: "1aa7df01-9c2f-4d31-8e22-f433e16c72ba",
    },
    {
      movie_id: "47ef0a76-fbed-4d6f-bdd5-55ffc6506c03",
      genre_id: "2ca9f2c6-e473-431c-ae20-16069deed6ce",
    },
    {
      movie_id: "47ef0a76-fbed-4d6f-bdd5-55ffc6506c03",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "e3d0cd0e-4150-4118-a227-329dfae69d9f",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "e3d0cd0e-4150-4118-a227-329dfae69d9f",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "7da10bde-8a57-491d-8da3-0660279fdc5e",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "7da10bde-8a57-491d-8da3-0660279fdc5e",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "7da10bde-8a57-491d-8da3-0660279fdc5e",
      genre_id: "2ca9f2c6-e473-431c-ae20-16069deed6ce",
    },
    {
      movie_id: "91ff065e-e390-4721-8b0e-1b3da38f5945",
      genre_id: "b9217547-6576-4b81-9e40-7b5284081fd9",
    },
    {
      movie_id: "91ff065e-e390-4721-8b0e-1b3da38f5945",
      genre_id: "3af03542-ed18-425b-ab78-bd23a601e383",
    },
    {
      movie_id: "91ff065e-e390-4721-8b0e-1b3da38f5945",
      genre_id: "85ea1bd9-fc89-4d16-99a9-59d00e6fd212",
    }
  ]);
}
