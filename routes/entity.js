const entityController = require("../controllers/entity");
const express = require("express");
const { authentication } = require("../middleware/protected");

const upload = require("../middleware/upload");
const router = express.Router();

router.post("/", authentication, entityController.createEntity);
router.get("/", authentication, entityController.getEntities);
router.get("/countries", entityController.fetchCountries);
router.post("/uploads", upload.single("file"), entityController.uploadCSV);
router.get("/:id", authentication, entityController.getSingleEntity);
router.patch("/:id", authentication, entityController.updateEntity);
router.delete("/:id", authentication, entityController.removeEntity);

module.exports = router;
