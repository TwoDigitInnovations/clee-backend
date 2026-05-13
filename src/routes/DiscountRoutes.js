const express = require('express');
const router = express.Router();
const Discount = require('@controllers/DiscountsController');
const auth = require('@middlewares/authMiddleware');

router.use(auth());
router.route('/').post(Discount.createDiscount).get(Discount.getAllDiscounts);

router
  .route('/:id')
  .get(Discount.getDiscountById)
  .put(Discount.updateDiscount)
  .delete(Discount.deleteDiscount);

router.patch('/toggle-status/:id', Discount.toggleStatus);

module.exports = router;
