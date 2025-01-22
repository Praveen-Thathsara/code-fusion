/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('gift_voucher').del()
  await knex('gift_voucher').insert([
    { id: "ad8b570b-0084-4e6e-9f26-aa5f8c17fbc2", sender_id:"da9347a6-2a7f-4573-be27-15f05569fb0d", receiver_id:"c784dd78-b26e-4cc0-9c8a-b84bdb4330b9", amount:200, issued_at:"2024-04-10T11:37:01.316Z", status:"unclaimed" },  
  ]);
}
