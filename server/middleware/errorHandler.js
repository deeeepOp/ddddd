export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size must be less than 10MB'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Invalid file',
      message: 'Only one file is allowed'
    });
  }
  
  // Database errors
  if (err.code === 'SQLITE_ERROR') {
    return res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while accessing the database'
    });
  }
  
  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
}