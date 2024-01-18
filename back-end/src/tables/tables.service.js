const knex = require("../db/connection");

async function list() {
  return knex("tables as t")
    .join("tables_reservations as tr", "t.table_id", "tr.table_id")
    .select("t.*", "tr.available");
}

async function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

module.exports = {
  list,
  create,
};
