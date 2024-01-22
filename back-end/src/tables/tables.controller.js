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
  const newTable = await service.create(req.body.data);
  await service.insertTableToTableReservations(newTable);
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

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const foundReservation = await service.readReservation(reservation_id);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  next({ status: 404, message: `reservation_id: ${reservation_id} not found` });
}

async function tableIsFree(req, res, next) {
  const isAvailable = await service.readAvailable(res.locals.table.table_id);
  if (isAvailable.available !== "Free") {
    next({
      status: 400,
      message: `table_id: ${isAvailable.table_id} is occupied`,
    });
  }
  res.locals.table_reservation = isAvailable;
  return next();
}

async function tableHasCapacity(req, res, next) {
  const { capacity } = res.locals.table;
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
    available: "Occupied",
  };
  console.log("update", resUpdate);
  res.status(200).json({
    data: await service.update(resUpdate),
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
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableIsFree),
    tableHasCapacity,
    asyncErrorBoundary(update),
  ],
};
