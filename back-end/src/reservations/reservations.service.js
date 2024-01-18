const knex = require("../db/connection");

async function list(date) {
  return knex("reservations").select("*").where({ reservation_date: date });
}

async function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

module.exports = {
  list,
  create,
};