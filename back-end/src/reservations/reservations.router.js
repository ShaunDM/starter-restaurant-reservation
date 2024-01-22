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

router.use(
  "/:reservation_Id/tables",
  controller.reservationExists,
  tablesRouter
);

router
  .route("/:reservation_Id")
  .get(corsGet, controller.read)
  .options(corsGet)
  .all(methodNotAllowed);

router
  .route("/new")
  .post(corsPost, controller.create)
  .options(corsPost)
  .all(methodNotAllowed);

router
  .route("/")
  .post(corsPost, controller.create)
  .options(corsPost)
  .get(corsGet, controller.list)
  .options(corsGet)
  .all(methodNotAllowed);

module.exports = router;
