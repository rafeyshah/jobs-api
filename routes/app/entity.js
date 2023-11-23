const entityController = require("../../controllers/entity");
const express = require("express");
const { authentication } = require("../../middleware/protected");

const upload = require("../../middleware/upload");
const router = express.Router();

router.get("/", authentication, entityController.getAppEntities);

module.exports = router;
