const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../services/fileUpload');

router.post('/', upload.single('photo'), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('photo'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/adjust-stock', productController.adjustStock);
router.get('/:id/history', productController.getStockHistory);

module.exports = router;
