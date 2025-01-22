/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("movie", (table) => {
    table.string("id").primary();
    table.string("title").notNullable();
    table.integer("year").notNullable();
    table.float("daily_rental_rate").notNullable();
    table.float("discount_rate").notNullable();
    table.float("imdb_rating").notNullable();
    table.string("poster_url").notNullable();
    table.string("banner_url").notNullable();
    table.string("plot").notNullable();
    table.string("runtime").notNullable();
    table.string("directed_by").notNullable();
    table.string("starring").notNullable();
    table.string("release_at").notNullable();
    table.boolean("is_deleted").defaultTo(false).notNullable();
    table.unique(["title", "year"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("movie");
}
