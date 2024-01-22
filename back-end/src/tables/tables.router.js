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

router
  .route("/:table_id/seat")
  .put(corsPut, controller.update)
  .options(corsPut)
  .all(methodNotAllowed);

router
  .route("/new")
  .post(corsPost, controller.create)
  .options(corsPost)
  .all(methodNotAllowed);

router
  .route("/")
  .get(corsGet, controller.list)
  .options(corsGet)
  .post(corsPost, controller.create)
  .options(corsPost)
  .all(methodNotAllowed);

module.exports = router;
