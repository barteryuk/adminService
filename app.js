if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const PORT = require("./config/properties").PORT;
const db = require("./config/database");
const router = require("./routes");
const errorHandler = require("./middlewares/errorhandler");

const app = express();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server adminService is running on: ", PORT);
});
