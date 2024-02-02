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
 * Generic hasValidProperties function.
 * Checks for valid properties in requests.
 * Checks for req.body.data and passes an array to hasProperty to test for a list of key:value pairs that should exist.
 * @param properties
 * array of keys to check for in req.body.data
 */

function hasValidProperties(properties, req, res, next) {
  const methodName = "hasValidProperties";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.body.data) {
    const message = "body must have a data property";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  properties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
  req.log.trace({ __filename, methodName, valid: true });
}

/**
 * Passes an array of needed properties to hasValidProperties to check for in post requests.
 */

function hasValidPropertiesPost(req, res, next) {
  const methodName = "hasValidPropertiesPost";
  req.log.debug({ __filename, methodName, body: req.body });
  const needsProperties = ["table_name", "capacity"];
  hasValidProperties(needsProperties, req, res, next);
  next();
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

/**
 * .
 */

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

function hasValidPropertiesPut(req, res, next) {
  const methodName = "hasValidPropertiesPut";
  req.log.debug({ __filename, methodName, body: req.body });
  const needsProperties = ["reservation_id"];
  hasValidProperties(needsProperties, req, res, next);
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

async function tableExists(req, res, next) {
  const methodName = "tableExists";
  req.log.debug({ __filename, methodName, body: req.body, params: req.params });
  const { table_id } = req.params;
  const foundTable = await service.readTable(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
    return next();
  }
  const message = `table_id: ${table_id} not found`;
  next({ status: 404, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

async function tableIsFree(req, res, next) {
  const methodName = "tableIsFree";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const isSeated = await service.readAvailable(res.locals.table.table_id);
  if (isSeated.reservation_id) {
    const message = `table_id: ${isSeated.table_id} is occupied`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 400,
      message: message,
    });
  }
  res.locals.table_reservation = isSeated;
  req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
  next();
}

async function tableHasCapacity(req, res, next) {
  const methodName = "tableHasCapacity";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const { capacity } = res.locals.table;

  //Need to include the following if statement to pass thinkful tests and maintain Group-by-resource organization otherwise. Thinkful tests do not include URLs with multiple params and I don't know how to keep controller and service files inclusive to their table without merging params from another router.

  if (!res.locals.reservation) {
    await reservationExists(req, res, next);
  }
  const { people } = res.locals.reservation;
  if (capacity < people) {
    const message = "Table capacity is smaller than reservation size";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  return next();
}

async function reservationExists(req, res, next) {
  const methodName = "reservationExists";
  req.log.debug({ __filename, methodName, body: req.body });
  let reservation_id = "";

  //Since this function tests for a reservation for multiple types of requests, some of which don't include it in the req body and some do, while none put it in the route parameters, the if statements assign it to res.locals based on the type of request rather than making a new function for each.

  if (!req.body.data) {
    reservation_id = res.locals.table.reservation_id;
  } else {
    reservation_id = req.body.data.reservation_id;
  }
  const foundReservation = await service.readReservation(reservation_id);
  if (!foundReservation) {
    const message = `reservation_id: ${reservation_id} not found`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 404,
      message: message,
    });
  }
  req.log.trace({
    __filename,
    methodName,
    valid: true,
    data: foundReservation,
  });
  res.locals.reservation = foundReservation;
}

function reservationIsAlreadySeated(req, res, next) {
  const methodName = "reservationIsAlreadySeated";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const { status, reservation_id } = res.locals.reservation;
  if (status === "seated") {
    const message = `Reservation: ${reservation_id} is already seated.`;
    return next({ status: 400, message: message });
  }
  next();
}

async function update(req, res, next) {
  const methodName = "update";
  req.log.debug({ __filename, methodName, locals: res.locals });
  const reservationUpdate = {
    ...res.locals.table_reservation,
    reservation_id: res.locals.reservation.reservation_id,
  };
  res.locals.reservationStatusUpdate = {
    ...res.locals.reservation,
    status: "seated",
  };
  await updateReservations(req, res, next);
  await service.updateTables(
    res.locals.table,
    res.locals.reservation.reservation_id
  );
  res.status(200).json({
    data: await service.update(reservationUpdate),
  });
  req.log.trace({
    __filename,
    methodName,
    return: true,
    data: reservationUpdate,
  });
}

/*reservations update

  I don't know how to keep group by resource without merge params and my controller for reservations often requires the reservation_id in the params, rather than messing with my reservations controller, I copy and pasted the relevant functions and fit them to requests to tables below.

  */

function reservationStatusIsNotFinished(req, res, next) {
  const methodName = "reservationStatusIsNotFinished";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const { status } = res.locals.reservation;
  if (status === "finished") {
    const message =
      "Reservation status cannot be updated if it is already 'finished'.";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasValidStatus(req, res, next) {
  const methodName = "hasValidStatus";
  req.log.debug({ __filename, methodName, body: req.body });
  const { status } = res.locals.reservationStatusUpdate;
  if (!status) {
    const message = "Status update is undefined";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  const validStatuses = ["booked", "seated", "finished"];
  if (!validStatuses.includes(status)) {
    const statusList = validStatuses.join(", ");
    const message = `Reservation status: ${status} is invalid, valid statuses are: ${statusList}.`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 400,
      message: message,
    });
  }
  req.log.trace({ __filename, methodName, valid: true });
}

async function updateReservations(req, res, next) {
  hasValidStatus(req, res, next);
  const methodName = "updateReservations";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const reservationUpdate = res.locals.reservationStatusUpdate;
  const updatedReservation = await service.updateReservations(
    reservationUpdate
  );
  req.log.trace({
    __filename,
    methodName,
    return: true,
    data: updatedReservation[0],
  });
}

//destroy

async function isOccupied(req, res, next) {
  const methodName = "isOccupied";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const isSeated = await service.readAvailable(res.locals.table.table_id);
  if (!isSeated.reservation_id) {
    const message = `table_id: ${isSeated.table_id} is not occupied`;
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({
      status: 400,
      message: message,
    });
  }
  if (!res.locals.reservation) {
    await reservationExists(req, res, next);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

async function destroy(req, res, next) {
  const methodName = "update";
  req.log.debug({ __filename, methodName, locals: res.locals });
  const { table_id } = res.locals.table;
  await service.destroy(table_id);
  await service.insertTableToTableReservations(table_id);
  res.locals.reservationStatusUpdate = {
    ...res.locals.reservation,
    status: "finished",
  };
  await updateReservations(req, res, next);
  res.status(200).json({ data: res.locals.table });
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
    hasValidPropertiesPost,
    hasValidNameLength,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    hasValidPropertiesPut,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableIsFree),
    asyncErrorBoundary(tableHasCapacity),
    reservationIsAlreadySeated,
    reservationStatusIsNotFinished,
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isOccupied),
    reservationStatusIsNotFinished,
    asyncErrorBoundary(destroy),
  ],
};
