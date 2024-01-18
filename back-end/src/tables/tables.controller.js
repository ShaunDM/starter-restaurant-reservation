const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await service.list();
  res.json({
    data,
  });
}

function hasValidNameLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.lenth < 2) {
    next({
      status: 400,
      message: "Table name must be at least two characters in length.",
    });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (parseInt(capacity) < 1) {
    next({ status: 400, message: "Capacity has a minimum amount of 1." });
  }
  next();
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidNameLength, hasValidCapacity, asyncErrorBoundary(create)],
};
