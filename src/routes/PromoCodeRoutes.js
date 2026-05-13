const express = require('express');
const router = express.Router();
const PromoCode = require('../controllers/PromoCodeController');
const auth = require('@middlewares/authMiddleware');

router.post('/validate', PromoCode.validatePromoCode);

router.use(auth());

router
  .route('/')
  .post(PromoCode.createPromoCode)
  .get(PromoCode.getAllPromoCodes);

router
  .route('/:id')
  .get(PromoCode.getPromoCode)
  .put(PromoCode.updatePromoCode)
  .delete(PromoCode.deletePromoCode);

router.patch('/:id/toggle-status', PromoCode.toggleStatus);

module.exports = router;
