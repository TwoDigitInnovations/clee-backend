const express = require('express');
const router = express.Router();
const PackagesController = require('@controllers/PackagesController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('../services/fileUpload');

router.use(auth());

router
  .route('/')
  .post(upload.single('photo'), PackagesController.createPackage)
  .get(PackagesController.getAllPackages);

router
  .route('/:id')
  .get(PackagesController.getPackage)
  .put(upload.single('photo'), PackagesController.updatePackage)
  .delete(PackagesController.deletePackage);

router.patch('/:id/toggle-status', PackagesController.toggleStatus);

module.exports = router;
