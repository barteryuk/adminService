const router = require("express").Router();
const Routes = require("./admin");

router.get("/", (req, res) => res.send("welcome to adminService"));
router.use("/admins", Routes);

module.exports = router;
