const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const saucesController = require('../controllers/sauces');

router.get('/', auth, saucesController.getAllSauces);


module.exports = router;
