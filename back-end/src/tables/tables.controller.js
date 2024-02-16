/**
 * Defines the controller for tables and tables_reservations resources.
 *Also controls reservations resources.
 */

const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//list

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  const data = await service.list();
  res.json({
    data: data,
  });
  req.log.trace({ __filename, methodName, return: true, data: data });
}

//create

/**
 * Checks req.body.data if a given key:value pair exists.
 * @param property
 * key to check for in req.body.data
 */

function hasProperty(property, req, res, next) {
  const methodName = `hasProperty('${property}')`;
  req.log.debug({ __filename, methodName, body: req.body });
  const { data } = req.body;
  if (!data[property]) {
    const message = `Table must include a ${property} property.`;
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  } else {
    req.log.trace({ __filename, methodName, valid: true });
  }
}

/**
 * Checks for valid properties in post requests.
 * Checks for req.body.data and passes an array to hasProperty to test for a list of key:value pairs that should exist.
 */
function hasValidProperties(req, res, next) {
  const methodName = "hasValidProperties";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.body.data) {
    const message = "body must have a data property";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  const needsProperties = ["table_name", "capacity"];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
  req.log.trace({ __filename, methodName, valid: true });
}

function hasValidNameLength(req, res, next) {
  const methodName = "hasValidNameLength";
  req.log.debug({ __filename, methodName, body: req.body });
  const { table_name } = req.body.data;
  if (parseInt(table_name.length) < 2) {
    const message = "table_name must be at least two characters in length.";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasValidCapacity(req, res, next) {
  const methodName = "hasValidCapacity";
  req.log.debug({ __filename, methodName, body: req.body });
  const { capacity } = req.body.data;
  if (!Number.isInteger(capacity)) {
    const message = "Table capacity is not a number";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  if (capacity < 1) {
    const message = "Capacity has a minimum amount of 1.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data } = req.body;
  const newTable = await service.create(data);
  await service.insertTableToTableReservations(
    newTable.table_id,
    newTable.reservation_id
  );
  res.status(201).json({ data: newTable });
  req.log.trace({ __filename, methodName, return: true, data: newTable });
}

//update

/**
 * Passes an array of needed properties to hasValidProperties to check for in put requests.
 */

async function tableExists(req, res, next) {
  const methodName = "tableExists";
  req.log.debug({ __filename, methodName, body: req.body, params: req.params });
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
    return next();
  }
  const message = `table_id: ${table_id} not found`;
  next({ status: 404, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function reservationExists(req, res, next) {
  const methodName = "reservationExists";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  if (!res.locals.reservation) {
    const message = "No reservation parameter, improper request.";
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({ status: 400, message: message });
  }
  next();
}

function urlHasValidPath(req, res, next) {
  const methodName = "urlHasValidPath";
  req.log.debug({ __filename, methodName, path: req.path });
  if (req.path !== "seat" && req.path !== "finish") {
    const message = `URL: ${req.originalUrl} has invalid path: ${req.path}, valid paths are 'seat' or 'finish'.`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 400,
      message: message,
    });
  }
  req.log.trace({ __filename, methodName, valid: true });
  next();
}

function tableHasCapacity(req, res, next) {
  const methodName = "tableHasCapacity";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (capacity < people) {
    const message = "Table capacity is smaller than reservation party";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  return next();
}

function tableHasCorrectStatus(req, res, next) {
  const methodName = "tableHasCorrectStatus";
  req.log.debug({ __filename, methodName, path: req.path, locals: res.locals });
  const { table } = res.locals;
  if (table.reservation_id && req.path === "seat") {
    const message = `table: ${table.table_name} is occupied`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 400,
      message: message,
    });
  } else if (!table.reservation_id && req.path === "finish") {
    const message = `table: ${table.table_name} is unoccupied`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 400,
      message: message,
    });
  }
  req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
  next();
}

//A table's availability depends on reservation_id being "true". Set's reservation_id based on req.path.
function setStatus(req, res, next) {
  const methodName = "setStatus";
  req.log.debug({ __filename, methodName, path: req.path, locals: res.locals });
  const { reservation_id } = res.locals.table;
  if (req.path === "seat") {
    reservation_id = res.locals.reservation.reservation_id;
  } else {
    reservation_id = null;
  }
  req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
  next();
}

async function update(req, res) {
  const methodName = "update";
  req.log.debug({ __filename, methodName, locals: res.locals });
  res.status(200).json({
    data: await service.update(res.locals.table),
  });
  req.log.trace({
    __filename,
    methodName,
    return: true,
    data: res.locals.table,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidProperties,
    hasValidNameLength,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    reservationExists,
    urlHasValidPath,
    tableHasCapacity,
    tableHasCorrectStatus,
    setStatus,
    asyncErrorBoundary(update),
  ],
};
