exports.up = function (knex) {
  return knex.schema.createTable("logs", (table) => {
    table.string("log_id").primary();
    table.string("label").notNullable();
    table.integer("value").notNullable();
    table.string("file_name").notNullable();
    table.string("method_name").notNullable();
    table.string("message").notNullable();
    table.text("params").defaultTo(null);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("logs");
};
