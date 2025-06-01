export default (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
};
