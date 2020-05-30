const app = require("../app");
const http = require("http");
const PORT = require("../config/properties").PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server adminService is running on: ", PORT);
});
