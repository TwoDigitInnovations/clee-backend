const express = require('express');
const router = express.Router();
const PriceTier = require('../controllers/PriceTierController');
const auth = require("@middlewares/authMiddleware");

router.post('/save', auth(), PriceTier.createOrUpdatePriceTier);
router.get('/getAll', auth(), PriceTier.getAllPriceTiers);
router.get('/:id', auth(), PriceTier.getPriceTierById);
router.put('/update/:id', auth(), PriceTier.updatePriceTier);
router.delete('/delete/:id', auth(), PriceTier.deletePriceTier);

module.exports = router;
