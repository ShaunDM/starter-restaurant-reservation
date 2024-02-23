/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const cors = require("cors");
const router = require("express").Router({ mergeParams: true });
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");

const corsGet = cors({ method: "GET" });
const corsPost = cors({ method: "POST" });
const corsPut = cors({ method: "PUT" });

//When it tries to route back to the parent router (reservations) it fails if I use .all(methodNotAllowed).

router
  .route("/:table_id/finish")
  .put(corsPut, controller.update)
  .options(corsPut)
  .get(methodNotAllowed)
  .post(methodNotAllowed)
  .delete(methodNotAllowed);

router
  .route("/:table_id/seat")
  .put(corsPut, controller.update)
  .options(corsPut)
  .get(methodNotAllowed)
  .post(methodNotAllowed)
  .delete(methodNotAllowed);

router
  .route("/new")
  .post(corsPost, controller.create)
  .options(corsPost)
  .all(methodNotAllowed);

router
  .route("/")
  .get(corsGet, controller.list)
  .options(corsGet)
  .all(methodNotAllowed);

module.exports = router;
