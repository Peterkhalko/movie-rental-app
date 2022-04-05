module.exports = function (app) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log("server is up and running at port 8000 at dev env");
  });
};
