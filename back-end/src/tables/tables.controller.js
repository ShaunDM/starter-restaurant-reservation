const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//List

async function list(req, res) {
  const data = await service.list();
  res.json({
    data,
  });
}

//Create

function hasProperty(property, req, res, next) {
  const { data } = req.body;
  if (!data[property]) {
    next({
      status: 400,
      message: `Reservation must include a ${property} property.`,
    });
  }
}

//Checks the request to make sure it has all the valid properties needed for a post request.

function hasValidPropertiesPost(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "body must have a data property" });
  }
  const needsProperties = ["table_name", "capacity"];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
  next();
}

function hasValidNameLength(req, res, next) {
  const { table_name } = req.body.data;
  if (parseInt(table_name.length) < 2) {
    next({
      status: 400,
      message: "table_name must be at least two characters in length.",
    });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (!Number.isInteger(capacity)) {
    next({ status: 400, message: "Table capacity is not a number" });
  }
  if (capacity < 1) {
    next({ status: 400, message: "Capacity has a minimum amount of 1." });
  }
  next();
}

async function create(req, res) {
  const { data } = req.body;
  const newTable = await service.create(data);
  await service.insertTableToTableReservations(
    newTable.table_id,
    newTable.reservation_id
  );
  res.status(201).json({ data: newTable });
}

//Update

function hasValidPropertiesPut(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "body must have a data property" });
  }
  const needsProperties = ["reservation_id"];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.readTable(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    return next();
  }
  next({ status: 404, message: `table_id: ${table_id} not found` });
}

async function tableIsFree(req, res, next) {
  const isSeated = await service.readAvailable(res.locals.table.table_id);
  console.log(isSeated);
  if (isSeated.reservation_id) {
    next({
      status: 400,
      message: `table_id: ${isSeated.table_id} is occupied`,
    });
  }
  res.locals.table_reservation = isSeated;
  return next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const foundReservation = await service.readReservation(reservation_id);
  if (foundReservation) {
    return foundReservation;
  }
  next({
    status: 404,
    message: `reservation_id: ${reservation_id} not found`,
  });
}

async function tableHasCapacity(req, res, next) {
  const { capacity } = res.locals.table;

  //Need to include the following if statement to pass thinkful tests and maintain RESTful design otherwise. Thinkful tests do not include multiple params and I don't know how to keep controller and service files inclusive to their table without merging params from another router.

  if (!res.locals.reservation) {
    res.locals.reservation = await reservationExists(req, res, next);
  }
  const { people } = res.locals.reservation;
  if (capacity < people) {
    next({
      status: 400,
      message: "Table capacity is smaller than reservation size",
    });
  }
  return next();
}

async function update(req, res) {
  const resUpdate = {
    ...res.locals.table_reservation,
    reservation_id: res.locals.reservation.reservation_id,
  };
  res.status(200).json({
    data: await service.update(resUpdate),
  });
}

/*Delete, instructions state that they want to delete the data table's row when guests are finished with their meal to "free" their table despite wanting to see the newly freed table as available after deletion and the hints for tests -04 stating: 

*Hint Seed the tables table in a similar way as it's done with the reservations table.
*Hint Add a reservation_id column in the tables table. Use the .references() and inTable() knex functions to add the foreign key reference.

to keep track of whether a table is occupied. So, instead of a simple put request to the relevant row from the joined table I created in place of creating a new migration for the tables table; I will be deleting and reposting the row for the joined table. Ignoring the hints to maintain consistent table_id*/

async function isOccupied(req, res, next) {
  const isSeated = await service.readAvailable(res.locals.table.table_id);
  if (!isSeated.reservation_id) {
    next({
      status: 400,
      message: `table_id: ${isSeated.table_id} is not occupied`,
    });
  }
  next();
}

async function destroy(req, res) {
  const { table_id } = res.locals.table;
  await service.destroy(table_id);
  await service.insertTableToTableReservations(table_id);
  res.status(200).json({ data: res.locals.table });
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
