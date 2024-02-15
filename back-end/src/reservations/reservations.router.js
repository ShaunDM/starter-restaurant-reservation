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
  .put(corsPut, controller.updateStatus)
  .options(corsPut)
  .all(methodNotAllowed);

router
  .route("/:reservation_Id")
  .get(corsGet, controller.read)
  .options(corsGet)
  .put(corsPut, controller.update)
  .options(corsPut)
  .all(methodNotAllowed);

router
  .route("/")
  .get(corsGet, controller.list)
  .options(corsGet)
  .all(methodNotAllowed);

module.exports = router;
