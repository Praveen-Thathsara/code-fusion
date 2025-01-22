/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("genre").del();
  await knex("genre").insert([
    { id: "b9217547-6576-4b81-9e40-7b5284081fd9", name: "Action" },
    { id: "3af03542-ed18-425b-ab78-bd23a601e383", name: "Adventure" },
    { id: "1aa7df01-9c2f-4d31-8e22-f433e16c72ba", name: "Comedy" },
    { id: "23a0adc3-b180-4902-b2a5-124ed9f8ee7c", name: "Crime" },
    { id: "ba1de4bf-95ba-4fac-9844-37b7359178d5", name: "Mystery" },
    { id: "be3046f9-2975-4bd3-8edf-2f42be4532f0", name: "Drama" },
    { id: "85ea1bd9-fc89-4d16-99a9-59d00e6fd212", name: "Thriller" },
    { id: "2ca9f2c6-e473-431c-ae20-16069deed6ce", name: "Romance" },
    { id: "d02b3f2f-f659-488f-90fa-b2452151c7ba", name: "Fantasy" },
  ]);
}
