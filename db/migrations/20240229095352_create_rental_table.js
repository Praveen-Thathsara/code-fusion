/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("rental", (table) => {
    table.string("id").primary();
    table
      .string("user_id")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.string("movie_id").unsigned().references("id").inTable("movie");
    table.dateTime("rented_at").notNullable();
    table.integer("days_rented").defaultTo(1);
    table.float("rental_fee").notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("rentals");
}
