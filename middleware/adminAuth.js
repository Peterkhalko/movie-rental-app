module.exports = function (req, res, next) {
  console.log("admin auth req", req.user);
  if (!req.user.isAdmin) return res.status(403).send("Forbidden");
  next();
};
