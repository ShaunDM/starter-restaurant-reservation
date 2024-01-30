/*
 Controller for managing frontend logging database.
*/
const service = require("./logging.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const methodName = "list";
  req.log.debug({
    __filename,
    methodName,
    locals: res.locals,
  });
  let data = await service.list();
  res.json({
    data: data,
  });
  req.log.trace({ __filename, methodName, return: true, data: data });
}

function hasRequestId(req, res, next) {
  const methodName = "hasRequestId";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.id) {
    const message = "Request must include an id.";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  res.locals.log = { log_id: req.id };
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasProperty(property, req, res, next) {
  const methodName = `hasProperty('${property}')`;
  req.log.debug({ __filename, methodName, body: req.body });
  const { messages, level } = req.body.data;
  if (property === "label" || property === "value") {
    if (!level[property]) {
      const message = `Log level must include a ${property} property.`;
      req.log.trace({ __filename, methodName, valid: false }, message);
      return next({
        status: 400,
        message: message,
      });
    }
    res.locals.log = {
      ...res.locals.log,
      [property]: req.body.data.level[property],
    };
  } else {
    if (!messages[0][property]) {
      const message = `Log message must include a ${property} property.`;
      req.log.trace({ __filename, methodName, valid: false }, message);
      return next({
        status: 400,
        message: message,
      });
    }
    res.locals.log = {
      ...res.locals.log,
      [property]: messages[0][property],
    };
  }

  req.log.trace({ __filename, methodName, valid: true });
}

function hasValidProperties(req, res, next) {
  const methodName = "hasValidProperties";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.body.data) {
    const message = "body must have data property.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  const needsProperties = [
    "method_name",
    "file_name",
    "message",
    "label",
    "value",
  ];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
  if (req.body.data.messages[0].params) {
    res.locals.log = {
      ...res.locals.log,
      params: req.body.data.messages[0].params,
    };
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const newLog = await service.create(res.locals.log);
  req.log.trace({
    __filename,
    methodName,
    return: true,
    data: newLog,
  });
  res.sendStatus(204);
}

async function truncate(req, res) {
  const methodName = "truncate";
  req.log.debug({ __filename, methodName });
  await service.truncate();
  res.status(204);
  req.log.trace({
    __filename,
    methodName,
    return: true,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequestId, hasValidProperties, asyncErrorBoundary(create)],
  truncate: asyncErrorBoundary(truncate),
};
