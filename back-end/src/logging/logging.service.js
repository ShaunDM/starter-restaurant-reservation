/**
 * Defines the service functions for frontend logging resources.
 */

const knex = require("../db/connection");

async function list(level) {
  console.log("listService", level);
  return knex("logs")
    .where("value", ">=", level)
    .select("*")
    .orderBy("created_at");
}

async function create(newLog) {
  return knex("logs")
    .insert(newLog)
    .returning("*")
    .then((createdLogs) => createdLogs[0]);
}

async function truncate() {
  return knex("logs").truncate();
}

module.exports = {
  list,
  create,
  truncate,
};
