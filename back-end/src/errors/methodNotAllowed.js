/**
 * Express API error generation for disallowed methods.
 */

function methodNotAllowed(req, res, next) {
  next({
    status: 405,
    message: `Method ${req.method} not allowed for route: ${req.originalUrl}`,
  });
}

module.exports = methodNotAllowed;
