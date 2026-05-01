const express = require('express');
const router = express.Router();
const stockOrderController = require('../controllers/stockOrderController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth(), stockOrderController.createStockOrder);
router.get('/', auth(), stockOrderController.getAllStockOrders);
router.get('/:id', auth(), stockOrderController.getStockOrderById);
router.put('/:id', auth(), stockOrderController.updateStockOrder);
router.post('/:id/send', auth(), stockOrderController.sendStockOrder);
router.post('/:id/receive', auth(), stockOrderController.receiveStockOrder);
router.delete('/:id', auth(), stockOrderController.deleteStockOrder);
router.get('/supplier/:supplierId/products', auth(), stockOrderController.getProductsBySupplier);

module.exports = router;
