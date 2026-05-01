const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../services/fileUpload');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth(), upload.single('photo'), productController.createProduct);
router.get('/', auth(), productController.getAllProducts);
router.get('/:id', auth(), productController.getProductById);
router.put('/:id', auth(), upload.single('photo'), productController.updateProduct);
router.delete('/:id', auth(), productController.deleteProduct);
router.post('/:id/adjust-stock', auth(), productController.adjustStock);
router.get('/:id/history', auth(), productController.getStockHistory);

module.exports = router;
