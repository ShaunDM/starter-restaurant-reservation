const knex = require("../db/connection");

async function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

async function read(id) {
  return knex("reservations").select("*").where({ reservation_id: id }).first();
}

async function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

async function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .first()
    .returning("*")
    .update(reservation);
}

module.exports = {
  list,
  create,
  read,
  update,
};
