const mongoose = require("mongoose");
const dbUrl = require("./properties").DB;
const serviceName = require("./properties").SERVICE;

module.exports = () => {
  mongoose.connect(dbUrl, {
    dbName: serviceName,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose ${serviceName} is connected to: ${dbUrl}`);
  });

  mongoose.connection.on("error", (err) => {
    console.log(`Mongoose ${serviceName} connection has occurred ${err} error`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log(`Mongoose ${serviceName} has disconnected`);
  });

  process.on("SIGINT", () => {
    mongoose.connection.on("close", () => {
      console.log(
        `Mongoose ${serviceName} connection is disconnected due to application termination`
      );
    });
  });
};
