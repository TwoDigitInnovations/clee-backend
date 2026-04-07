const express = require('express');
const router = express.Router();
const stockOrderController = require('../controllers/stockOrderController');

// Create stock order
router.post('/', stockOrderController.createStockOrder);

// Get all stock orders
router.get('/', stockOrderController.getAllStockOrders);

// Get stock order by ID
router.get('/:id', stockOrderController.getStockOrderById);

// Update stock order
router.put('/:id', stockOrderController.updateStockOrder);

// Send stock order
router.post('/:id/send', stockOrderController.sendStockOrder);

// Delete stock order
router.delete('/:id', stockOrderController.deleteStockOrder);

// Get products by supplier
router.get('/supplier/:supplierId/products', stockOrderController.getProductsBySupplier);

module.exports = router;
