//Adding this column to comply with tests, as this is assignment I do not wish to alter tests for my solution.

exports.up = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.integer("reservation_id").unsigned().defaultTo(null);
  });
};

exports.down = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.dropColumn("reservation_id");
  });
};
