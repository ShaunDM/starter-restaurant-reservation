const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//List

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  const data = await service.list();
  res.json({
    data: data,
  });
  req.log.trace({ __filename, methodName, return: true, data: data });
}

//Create

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

//Checks the request to make sure it has all the valid properties needed for a post request.

function hasValidPropertiesPost(req, res, next) {
  const methodName = "hasValidPropertiesPost";
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

//Update

function hasValidPropertiesPut(req, res, next) {
  const methodName = "hasValidPropertiesPut";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.body.data) {
    const message = "body must have a data property";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  const needsProperties = ["reservation_id"];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
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
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  res.locals.table_reservation = isSeated;
  req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
  return next();
}

async function tableHasCapacity(req, res, next) {
  const methodName = "tableHasCapacity";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const { capacity } = res.locals.table;

  //Need to include the following if statement to pass thinkful tests and maintain Group-by-resource organization otherwise. Thinkful tests do not include multiple params and I don't know how to keep controller and service files inclusive to their table without merging params from another router.

  if (!res.locals.reservation) {
    res.locals.reservation = await reservationExists(req, res, next);
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
  const { reservation_id } = req.body.data;
  const foundReservation = await service.readReservation(reservation_id);
  if (foundReservation) {
    req.log.trace({
      __filename,
      methodName,
      valid: true,
      data: foundReservation,
    });
    return foundReservation;
  }
  const message = `reservation_id: ${reservation_id} not found`;
  next({
    status: 404,
    message: message,
  });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

async function update(req, res) {
  const methodName = "update";
  req.log.debug({ __filename, methodName, locals: res.locals });
  const reservationUpdate = {
    ...res.locals.table_reservation,
    reservation_id: res.locals.reservation.reservation_id,
  };
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

/*Delete

Instructions state that they want to delete the data table's row when guests are finished with their meal to "free" their table despite wanting to see the newly freed table as available after deletion and the hints for tests -04 stating: 

*Hint Seed the tables table in a similar way as it's done with the reservations table.
*Hint Add a reservation_id column in the tables table. Use the .references() and inTable() knex functions to add the foreign key reference.

to keep track of whether a table is occupied. So, instead of a simple put request to the relevant row; I will be deleting and reposting the row for the joined table I created to maintain a consistent table_id*/

async function isOccupied(req, res, next) {
  const methodName = "isOccupied";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const isSeated = await service.readAvailable(res.locals.table.table_id);
  if (!isSeated.reservation_id) {
    const message = `table_id: ${isSeated.table_id} is not occupied`;
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

async function destroy(req, res) {
  const methodName = "update";
  req.log.debug({ __filename, methodName, locals: res.locals });
  const { table_id } = res.locals.table;
  await service.destroy(table_id);
  await service.insertTableToTableReservations(table_id);
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
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isOccupied),
    asyncErrorBoundary(destroy),
  ],
};
