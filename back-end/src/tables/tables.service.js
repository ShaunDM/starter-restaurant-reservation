/**
 * Defines the service functions for tables and tables_reservations resources.
 * Also controls reservations resources.
 */

const knex = require("../db/connection");

async function read(id) {
  return knex("tables").where({ table_id: id }).select("*").first();
}

async function list() {
  return knex("tables")
    .select("table_id", "table_name", "capacity", "reservation_id")
    .orderBy("table_name");
}

async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTables) => createdTables[0]);
}

async function update(table) {
  return knex("tables")
    .where({ table_id: table.table_id })
    .first()
    .update(table)
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  read,
  list,
  create,
  update,
};
