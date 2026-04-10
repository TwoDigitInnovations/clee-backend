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
  UpdateCustomer,
  AddCustomer,
  getUserInfo,
  deleteCustomer,
} = require('@controllers/authController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

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
router.post(
  '/createCustomer',
  auth('admin'),
  upload.single('photo'),
  AddCustomer,
);
router.post('/updateCustomer/:editId', auth('admin'), upload.single('photo'),UpdateCustomer);
router.get('/getUserInfo/:editId', auth('admin'), getUserInfo);
router.delete('/deleteCustomer/:id', auth('admin'), deleteCustomer);

module.exports = router;
