exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE logs RESTART IDENTITY CASCADE");
};
