const knex = require("../db/connection");

async function listByDate(value) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: value })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}
async function listBySearch(value) {
  return knex("reservations")
    .where("mobile_number", "like", value)
    .select("*")
    .orderBy("reservation_date");
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

async function search(number) {
  return knex("reservations")
    .whereLike("mobile_number", `%${number}%`)
    .select("*");
}

module.exports = {
  listByDate,
  listBySearch,
  create,
  read,
  update,
};
