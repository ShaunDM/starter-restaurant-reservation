/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasDate(req, res, next){
  if(!req.query.date){
    next({status: 400, message: `A date must be given to fetch the according reservation list.`})
  }
  next();
}

async function list(req, res) {
  
  const data = await service.list(req.query.date);
  res.json({
    data,
  });
}

function hasProperty(property, req, res, next){
  const {data} = req.body;
  if(!data[property]){
    next({status: 400, message: `Reservation must include a ${property} property`})
  }
}

//Checks the request to make sure it has all the valid properties needed for a post request.

function hasValidProperties(req, res, next){
  if(!req.body.data){
    next({status: 400, message: "body must have data property"});
  }
  const needsProperties = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];
  needsProperties.forEach((property) => {
    hasProperty(property, req, res, next)
  });
  next();
}

async function create(req, res){
  const newReservation = await service.create(req.body.data);
  res.status(201).json({data: newReservation});
}

module.exports = {
  list: [hasDate, asyncErrorBoundary(list)],
  create: [hasValidProperties, asyncErrorBoundary(create)]
};
