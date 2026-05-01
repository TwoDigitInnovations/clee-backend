const express = require('express');
const router = express.Router();
const freeTrialController = require('@controllers/freeTrialController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.get('/setup', auth('admin', 'user'), freeTrialController.getSetup);
router.post('/step/profile', auth('admin', 'user'), upload.single('logo'), freeTrialController.saveProfile);
router.post('/step/branding', auth('admin', 'user'), freeTrialController.saveBranding);
router.post('/step/services', auth('admin', 'user'), freeTrialController.saveServices);
router.post('/step/staff', auth('admin', 'user'), freeTrialController.saveStaff);
router.post('/step/scheduling', auth('admin', 'user'), freeTrialController.saveScheduling);
router.post('/step/complete', auth('admin', 'user'), freeTrialController.completeSetup);

module.exports = router;
