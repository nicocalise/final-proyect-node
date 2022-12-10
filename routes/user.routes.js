const express = require("express");
const router = express.Router();

const { register, login, isAuth, logout } = require("../authentication/jwt");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", [isAuth], logout);

module.exports = router;