const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesController = require('../controllers/sauces');

router.get('/', auth, saucesController.getAllSauces);
router.get('/:id', auth, saucesController.getOneSauce);
router.post('/', auth, multer, saucesController.createSauce);
router.put('/:id', auth, multer, saucesController.modifySauce);
router.delete('/:id', auth, saucesController.deleteSauce);
// router.post('/:id/like', auth, saucesController.);


module.exports = router;
