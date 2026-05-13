const express = require('express');
const router = express.Router();

const Staff = require('@controllers/staffController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.get('/stats', auth(), Staff.getStaffStats);
router.post(
  '/create',
  auth(),
  upload.single('photo'),
  Staff.createStaff,
);
router.put(
  '/update/:id',
  auth(),
  upload.single('photo'),
  Staff.updateStaff,
);
router.get('/getAll', auth(), Staff.getAllStaff);
router.get('/:id', auth(), Staff.getStaffById);
router.delete('/delete/:id', auth(), Staff.deleteStaff);

module.exports = router;
