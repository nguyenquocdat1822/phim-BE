const UserRouter = require("./UserRouter");

const initWebRoute = (app) => {
  app.use("/api/user", UserRouter);
  // app.use("/api/product, ProductRouter")
};

module.exports = initWebRoute;
