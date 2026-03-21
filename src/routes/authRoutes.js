const express = require('express');
const router = express.Router();
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  changePassword,
  myProfile,
  getAllUser,
  updateprofile,
  updateStatus,
  resendOTP,
} = require('@controllers/authController');
const auth = require('@middlewares/authMiddleware');
// const { upload } = require('@services/fileUpload');

router.post('/login', login);
router.post('/register', register);
router.post('/updateStatus', auth('admin'), updateStatus);
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/resendOTP', resendOTP);
router.post('/changePassword', changePassword);
router.get('/profile', auth('admin', 'user'), myProfile);
router.post(
  '/updateprofile',
  auth('admin', 'user'),
  // upload.single('image'),
  updateprofile,
);
router.get('/getAllUser', auth('admin'), getAllUser);
module.exports = router;
