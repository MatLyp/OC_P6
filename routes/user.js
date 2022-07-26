//Routes User

const express = require('express');

const emailValidator = require('../middleware/email-validator');
const passwordValidator = require('../middleware/password-validator');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/signUp', emailValidator, passwordValidator, userController.signUp);
router.post('/login', userController.login);

module.exports = router;
