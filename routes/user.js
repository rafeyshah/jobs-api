const userController = require("../controllers/user");
const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/protected");
const { authorization } = require("../utils/authUtils");

router.post(
  "/signup",
  authentication,
  authorization("ADMIN"),
  userController.createUser
);
router.post("/login", userController.getUser);
router.delete(
  "/users/:id",
  authentication,
  authorization("ADMIN"),
  userController.deleteUser
);
router.patch(
  "/users/:id",
  authentication,
  authorization("ADMIN"),
  userController.updateUser
);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getSingleUser);
module.exports = router;
