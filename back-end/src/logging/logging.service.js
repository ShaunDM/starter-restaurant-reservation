const knex = require("../db/connection");

async function list() {
  return knex("logs as l").select("*").orderBy("l.created_at");
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
