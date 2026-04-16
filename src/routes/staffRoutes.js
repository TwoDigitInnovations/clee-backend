const express = require('express');
const router = express.Router();

const Staff = require('@controllers/staffController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.get('/stats', auth('admin'), Staff.getStaffStats);
router.post(
  '/create',
  auth('admin'),
  upload.single('photo'),
  Staff.createStaff,
);
router.put('/update/:id', auth('admin'), Staff.updateStaff);
router.get('/getAll', auth('admin'), Staff.getAllStaff);
router.get('/:id', auth('admin'), Staff.getStaffById);
router.delete('/delete/:id', auth('admin'), Staff.deleteStaff);

module.exports = router;
