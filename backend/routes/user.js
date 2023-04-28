const express = require("express");
const UserControllers = require('../controllers/user')
const router = express.Router();

router.post("/api/signup", UserControllers.createUser)

router.post("/api/login", UserControllers.userLogin)

module.exports = router;