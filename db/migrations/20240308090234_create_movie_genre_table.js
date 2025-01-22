/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("movie_genre", (table) => {
    table.string("movie_id").unsigned().references("id").inTable("movie");
    table.string("genre_id").unsigned().references("id").inTable("genre");
    table.primary(["movie_id", "genre_id"]);

  });
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("movie_genre");
}

