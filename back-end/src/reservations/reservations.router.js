/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const cors = require("cors");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reservations.controller");
const tablesRouter = require("../tables/tables.router");

const corsGet = cors({ method: "GET" });
const corsPost = cors({ method: "POST" });
const corsPut = cors({ method: "PUT" });

//Need to double up the router methods because frontend and backend use different routes for their tests.

router
  .route("/new")
  .post(corsPost, controller.create)
  .options(corsPost)
  .all(methodNotAllowed);

router.use(
  "/:reservation_Id/tables",
  controller.reservationExists,
  tablesRouter
);

router
  .route("/:reservation_Id/status")
  .put(corsPut, controller.update)
  .options(corsPut)
  .all(methodNotAllowed);

router
  .route("/:reservation_Id")
  .get(corsGet, controller.read)
  .options(corsGet)
  .all(methodNotAllowed);

router
  .route("/")
  .post(corsPost, controller.create)
  .options(corsPost)
  .get(corsGet, controller.list)
  .options(corsGet)
  .all(methodNotAllowed);

module.exports = router;
