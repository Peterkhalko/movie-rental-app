module.exports = function (error, req, res) {
  res.status(400).send("Somthing went wrong", error.message);
};
