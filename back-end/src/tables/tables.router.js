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
const corsDel = cors({ method: "DELETE" });

router
  .route("/:table_id/seat")
  .put(corsPut, controller.update)
  .options(corsPut)
  .delete(corsDel, controller.destroy)
  .options(corsDel)
  .all(methodNotAllowed);

//Need to double up the routes' methods because frontend and backend use different routes for their tests or at least the instructions for how to go about routing requests differ from the actual tests, as this is an assignment I do not wish to alter the tests or go against the instructions. Alternatively I could delete the "/new" route, but the course taught to be specific in routing for clarity, function, and security reasons; so I kept it as is.

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
