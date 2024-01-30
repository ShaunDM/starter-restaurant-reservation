/*
 Router for managing frontend logging database.
*/

const cors = require("cors");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./logging.controller");

const corsGet = cors({ method: "GET" });
const corsPost = cors({ method: "POST" });
const corsDel = cors({ method: "DELETE" });

router
  .route("/")
  .post(corsPost, controller.create)
  .options(corsPost)
  .get(corsGet, controller.list)
  .options(corsGet)
  .delete(corsDel, controller.truncate)
  .options(corsDel)
  .all(methodNotAllowed);

module.exports = router;
