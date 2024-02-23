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
  "/:reservation_id/edit/tables",
  corsPut,
  controller.update,
  tablesRouter
);

router.use(
  "/:reservation_id/tables",
  controller.checkStatusThenTables,
  tablesRouter,
  controller.updateStatusWTables
);

router
  .route("/:reservation_id/edit")
  .put(corsPut, controller.update)
  .options(corsPut)
  .all(methodNotAllowed);

router
  .route("/:reservation_id/cancel")
  .put(corsPut, controller.updateStatus)
  .options(corsPut)
  .all(methodNotAllowed);

router
  .route("/:reservation_id")
  .get(corsGet, controller.read)
  .options(corsGet)
  .all(methodNotAllowed);

router
  .route("/")
  .get(corsGet, controller.list)
  .options(corsGet)
  .all(methodNotAllowed);

module.exports = router;
