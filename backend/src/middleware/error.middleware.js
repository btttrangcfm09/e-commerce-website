// errorHandler.js
function errorHandler(err, req, res, next) {
    // Log the error details (this could be to a file or logging service)
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
}

module.exports = errorHandler;
