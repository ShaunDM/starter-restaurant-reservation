const knex = require("../db/connection");

async function list() {
  return knex("tables as t")
    .join("tables_reservations as tr", "t.table_id", "tr.table_id")
    .select("t.table_name", "t.table_id", "t.capacity", "tr.reservation_id")
    .orderBy("t.table_name");
}

async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTables) => createdTables[0]);
}

async function insertTableToTableReservations(table_id, reservation_id) {
  return knex("tables_reservations").insert({
    table_id: table_id,
    reservation_id: reservation_id,
  });
}

async function readTable(id) {
  return knex("tables").where({ table_id: id }).select("*").first();
}

async function readAvailable(id) {
  return knex("tables_reservations")
    .where({ table_id: id })
    .select("*")
    .first();
}

async function readReservation(id) {
  return knex("reservations").where({ reservation_id: id }).first().select("*");
}

async function update(table) {
  const { table_id } = table;
  return knex("tables_reservations")
    .returning("*")
    .where({ table_id: table_id })
    .first()
    .update(table);
}

async function destroy(id) {
  return knex("tables_reservations").where({ table_id: id }).del();
}

async function updateReservations(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .first()
    .update(reservation);
}

module.exports = {
  list,
  create,
  insertTableToTableReservations,
  readTable,
  readAvailable,
  readReservation,
  update,
  destroy,
  updateReservations,
};
