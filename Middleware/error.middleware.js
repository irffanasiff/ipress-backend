const notFound = (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
};

export { notFound, errorHandler}