const express = require("express");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express(); //định tuyến
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const port = process.env.PORT;

app.use(cors()); // Cho phép truy cập từ mọi URL

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

routes(app);

// Kệt nối cơ sở dữ liệu mongo
mongoose
  .connect(`${process.env.MONGO_DB}`, {
    serverSelectionTimeoutMS: 30000, // Tăng thời gian timeout lên 30 giây
  })
  .then(() => {""
    console.log("Connect DB is success!!!");
  })
  .catch((e) => {
    console.log("ERROR:", e);
  });

app.listen(port, () => {
  console.log(`The server is already running on port ${port}`);
});
