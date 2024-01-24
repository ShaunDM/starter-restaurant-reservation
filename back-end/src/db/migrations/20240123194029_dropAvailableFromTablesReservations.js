//dropping column because column information can be replaced by reservation_id column acting as a bool in a conditional statement

exports.up = function (knex) {
  return knex.schema.table("tables_reservations", (table) => {
    table.dropColumn("available");
  });
};

exports.down = function (knex) {
  return knex.schema.table("tables_reservations", (table) => {
    table.string("available").notNullable().defaultTo("Free");
  });
};
