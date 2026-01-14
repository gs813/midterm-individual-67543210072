// src/presentation/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'NotFoundError') {
        return res.status(404).json({ error: err.message });
    }

    if (err.name === 'ConflictError') {
        return res.status(409).json({ error: err.message });
    }

    // Default to 500
    res.status(500).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorHandler;