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

module.exports = {
  list,
  create,
  read,
};
