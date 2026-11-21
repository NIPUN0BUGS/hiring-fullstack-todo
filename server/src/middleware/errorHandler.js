export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body contains invalid JSON.' });
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }

  if (error?.message === 'Origin is not allowed by the CORS policy.') {
    return res.status(403).json({ success: false, message: 'This request origin is not permitted.' });
  }

  if (error?.name === 'ValidationError') {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, detail]) => [field, detail.message]),
    );
    return res.status(400).json({ success: false, message: 'Please check the task details.', errors });
  }

  if (error?.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'The supplied ID or value is invalid.' });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : error.message || 'Internal server error.',
  });
}
