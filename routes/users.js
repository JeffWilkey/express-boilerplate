const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Post to register a new user
router.post('/', userController.create);

module.exports = router;
