require("dotenv").config();
const path = require("path");

const {
  NODE_ENV = "development",
  PRODUCTION_DATABASE_URL = "postgresql://postgres@localhost/postgres",
  DEVELOPMENT_DATABASE_URL = "postgresql://postgres@localhost/postgres",
  DATABASE_URL_TEST = "postgresql://postgres@localhost/postgres",
  DATABASE_URL_PREVIEW = "postgresql://postgres@localhost/postgres",
  DEBUG,
} = process.env;

let URL = DEVELOPMENT_DATABASE_URL;

switch (NODE_ENV) {
  case "production": {
    URL = PRODUCTION_DATABASE_URL;
    break;
  }
  case "test": {
    URL = DATABASE_URL_TEST;
    break;
  }
  case "preview": {
    URL = DATABASE_URL_PREVIEW;
    break;
  }
  default: {
    break;
  }
}

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
