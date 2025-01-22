/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("feedback", (table)=> {
    table.string("user_id").unsigned().references("id").inTable("user");
    table.string("movie_id").unsigned().references("id").inTable("movie");
    table.float("rating").unsigned().notNullable();
    table.string("comment").nullable();
    table.dateTime("created_at").notNullable();
    table.primary(["user_id", "movie_id"]);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("feedback");
  
}
