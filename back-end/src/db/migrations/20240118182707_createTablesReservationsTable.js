/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tables_reservations", (table) => {
    table.integer("table_id").unsigned().notNullable();
    table
      .foreign("table_id")
      .references("table_id")
      .inTable("tables")
      .onDelete("CASCADE");
    table.string("available").notNullable().defaultTo("Free");
    table.integer("reservation_id").unsigned().defaultTo(null);
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tables_reservations");
};
