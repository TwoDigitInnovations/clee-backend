const express = require('express');
const router = express.Router();
const stockOrderController = require('../controllers/stockOrderController');


router.post('/', stockOrderController.createStockOrder);
router.get('/', stockOrderController.getAllStockOrders);
router.get('/:id', stockOrderController.getStockOrderById);
router.put('/:id', stockOrderController.updateStockOrder);
router.post('/:id/send', stockOrderController.sendStockOrder)
router.post('/:id/receive', stockOrderController.receiveStockOrder);

router.delete('/:id', stockOrderController.deleteStockOrder);
router.get('/supplier/:supplierId/products', stockOrderController.getProductsBySupplier);

module.exports = router;
