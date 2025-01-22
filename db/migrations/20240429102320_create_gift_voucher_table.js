/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("gift_voucher", (table) => {
        table.string("id").primary();
        table.string("sender_id").unsigned().references("id").inTable("user");
        table.string("receiver_id").unsigned().references("id").inTable("user");
        table.float("amount").notNullable();
        table.dateTime("issued_at").notNullable();
        table.string("status").notNullable().defaultTo("not redeemed");
    }
  );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("gift_voucher");
}
