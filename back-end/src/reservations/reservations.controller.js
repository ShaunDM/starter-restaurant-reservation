/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasDate(req, res, next) {
  if (!req.query.date) {
    next({
      status: 400,
      message: `A date must be given to fetch the according reservation list.`,
    });
  }
  next();
}

async function list(req, res) {
  const data = await service.list(req.query.date);
  res.json({
    data,
  });
}

//checks the day of the week to ensure valid, concat adds time element so that it's not checking against an inappropriate time zone upon date creation.

function hasValidDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const date = new Date(reservation_date.concat(", ", reservation_time));
  if (date.getDay() == 2) {
    next({
      status: 400,
      message: `The restaurant is closed on Tuesdays, invalid reservation day.`,
    });
  }
  if (Date.now() > Date.parse(date)) {
    next({ status: 400, message: `Reservation can't be made in the past.` });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time > "21:30" || reservation_time < "10:30") {
    next({
      status: 400,
      message:
        "Invalid time, restaurant opens at 10:30AM and allows for the last reservation at 9:30PM.",
    });
  }
  next();
}

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

function hasValidProperties(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "body must have data property" });
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
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: [hasDate, asyncErrorBoundary(list)],
  create: [
    hasValidProperties,
    hasValidTime,
    hasValidDate,
    asyncErrorBoundary(create),
  ],
};
