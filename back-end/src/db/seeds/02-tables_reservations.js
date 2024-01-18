/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const tableIds = await knex("tables").select("table_id");

  return knex
    .raw("TRUNCATE TABLE tables_reservations RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("tables_reservations").insert(tableIds);
    });
};
