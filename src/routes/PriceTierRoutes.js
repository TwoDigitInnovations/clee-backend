const express = require('express');
const router = express.Router();
const controller = require('../controllers/PriceTierController');

router.post('/add', controller.createPriceTier);
router.get('/', controller.getAllPriceTiers);
router.get('/:id', controller.getPriceTierById);
router.put('/update/:id', controller.updatePriceTier);
router.delete('/delete/:id', controller.deletePriceTier);

module.exports = router;
