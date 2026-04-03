const express = require('express');
const router = express.Router();
const PriceTier = require('../controllers/PriceTierController');
const auth = require("@middlewares/authMiddleware");

router.post('/save', auth('admin'), PriceTier.createOrUpdatePriceTier);
router.get('/getAll', auth('admin'), PriceTier.getAllPriceTiers);
router.get('/:id', auth('admin'), PriceTier.getPriceTierById);
router.put('/update/:id', auth('admin'), PriceTier.updatePriceTier);
router.delete('/delete/:id', auth('admin'), PriceTier.deletePriceTier);

module.exports = router;
