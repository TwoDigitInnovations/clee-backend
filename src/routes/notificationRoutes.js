const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getSettings,
  updateStaffSettings,
  updateEmailSettings,
  updateSMSSettings,
  sendTestNotification
} = require('../controllers/notificationController');

router.get('/templates', authMiddleware(), getTemplates);
router.get('/templates/:id', authMiddleware(), getTemplateById);
router.post('/templates', authMiddleware(), createTemplate);
router.put('/templates/:id', authMiddleware(), updateTemplate);
router.delete('/templates/:id', authMiddleware(), deleteTemplate);

router.get('/settings', authMiddleware(), getSettings);
router.put('/settings/staff', authMiddleware(), updateStaffSettings);
router.put('/settings/email', authMiddleware(), updateEmailSettings);
router.put('/settings/sms', authMiddleware(), updateSMSSettings);

router.post('/send-test', authMiddleware(), sendTestNotification);

module.exports = router;
