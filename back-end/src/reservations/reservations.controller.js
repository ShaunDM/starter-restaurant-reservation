/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasDate(req, res, next) {
  const methodName = "hasDate";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.query.date) {
    const message =
      "A date must be given to fetch the according reservation list.";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  next();
}

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  const data = await service.list(req.query.date);
  res.json({
    data: data,
  });
  req.log.trace({ __filename, methodName, return: true, data: data });
}

async function reservationExists(req, res, next) {
  const methodName = "reservationExists";
  req.log.debug({ __filename, methodName, body: req.body, params: req.params });
  const { reservation_Id } = req.params;
  const foundReservation = await service.read(reservation_Id);
  if (foundReservation) {
    req.log.trace({ __filename, methodName, valid: true, locals: res.locals });
    res.locals.reservation = foundReservation;
    return next();
  }
  const message = `reservation_id: ${reservation_Id} not found`;
  next({ status: 404, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function read(req, res) {
  const methodName = "read";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const { reservation } = res.locals;
  const data = {
    reservation_id: reservation.reservation_id,
    reservation: reservation,
  };
  res.status(200).json({
    data: data,
  });
  req.log.trace({ __filename, methodName, return: true, data: data });
}

//checks the day of the week to ensure valid, concat adds time element so that it's not checking against an inappropriate time zone upon date creation.

function hasValidDate(req, res, next) {
  const methodName = "hasValidDate";
  req.log.debug({ __filename, methodName, body: req.body });
  const { reservation_date, reservation_time } = req.body.data;
  const date = new Date(reservation_date.concat(", ", reservation_time));
  if (Number.isNaN(Date.parse(date))) {
    const message = "reservation_date is not a date.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  if (date.getDay() == 2) {
    const message =
      "The restaurant is closed on Tuesdays, invalid reservation day.";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  if (Date.now() > Date.parse(date)) {
    const message = "Reservation must be made in the future.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasValidTime(req, res, next) {
  const methodName = "hasValidTime";
  req.log.debug({ __filename, methodName, body: req.body });
  const { reservation_time } = req.body.data;
  const getHrsMin = reservation_time.split(":");
  const isNumber = getHrsMin.every((number) =>
    Number.isInteger(parseInt(number))
  );
  if (!isNumber) {
    const message = "reservation_time is not a time.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  if (reservation_time > "21:30" || reservation_time < "10:30") {
    const message =
      "Invalid time, restaurant opens at 10:30AM and allows for the last reservation at 9:30PM.";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasBookedStatus(req, res, next) {
  const methodName = "hasBookedStatus";
  req.log.debug({ __filename, methodName, body: req.body });
  const { status } = req.body.data;
  if (status && status !== "booked") {
    const message = `New reservations must be listed with 'booked' status, posted status as ${status}.`;
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasValidPeople(req, res, next) {
  const methodName = "hasValidPeople";
  req.log.debug({ __filename, methodName, body: req.body });
  const { people } = req.body.data;
  if (!Number.isInteger(people)) {
    const message = "Property people is not a number.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

function hasProperty(property, req, res, next) {
  const methodName = `hasProperty('${property}')`;
  req.log.debug({ __filename, methodName, body: req.body });
  const { data } = req.body;
  if (!data[property]) {
    const message = `Reservation must include a ${property} property.`;
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

function hasValidProperties(req, res, next) {
  const methodName = "hasValidProperties";
  req.log.debug({ __filename, methodName, body: req.body });
  if (!req.body.data) {
    const message = "body must have data property.";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  const needsProperties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_time",
    "reservation_date",
    "people",
  ];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next);
  });
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation[0] });
  req.log.trace({
    __filename,
    methodName,
    return: true,
    data: newReservation[0],
  });
}

//update reservation status

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
}

function hasValidStatus(req, res, next) {
  const methodName = "hasValidStatus";
  req.log.debug({ __filename, methodName, body: req.body });
  const { status } = req.body.data;
  console.log(status);
  if (!status) {
    const message = "Status update is undefined";
    next({
      status: 400,
      message: message,
    });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  const validStatuses = ["booked", "seated", "finished"];
  if (validStatuses.includes(status)) {
    return next();
  }
  const message = `Reservation status: ${status} is invalid, valid statuses are: ${statusList}.`;
  const statusList = validStatuses.join(", ");
  next({
    status: 400,
    message: message,
  });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

async function update(req, res) {
  const methodName = "update";
  req.log.debug({ __filename, methodName, body: req.body, locals: res.locals });
  const reservationUpdate = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  res.status(200).json({ data: await service.update(reservationUpdate) });
  req.log.trace({
    __filename,
    methodName,
    return: true,
    data: reservationUpdate,
  });
}

module.exports = {
  list: [hasDate, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    hasValidTime,
    hasValidDate,
    hasValidPeople,
    hasBookedStatus,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    reservationStatusIsNotFinished,
    hasValidStatus,
    asyncErrorBoundary(update),
  ],
  reservationExists,
};
