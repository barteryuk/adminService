const router = require("express").Router();
const Controller = require("../api/admin.controller");

router.post("/login", Controller.login);
router.post("/", Controller.create);
router.get("/", Controller.findAll);
router.get("/:email", Controller.findOne);
router.put("/:id", Controller.put);
router.delete("/:id", Controller.delete);

module.exports = router;
