exports.seed = function (knex) {
  return knex("logs").truncate();
};
