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
  blockUnblockCustomer,
} = require('@controllers/authController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.post('/login', login);
router.post('/register', register);
router.post('/updateStatus', auth(), updateStatus);
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/resendOTP', resendOTP);
router.post('/changePassword', changePassword);
router.get('/profile', auth(), myProfile);
router.post(
  '/updateprofile',
  auth(),
  upload.single('photo'),
  updateprofile,
);
router.get('/getAllUser', auth(), getAllUser);
router.post(
  '/createCustomer',
  auth(),
  upload.single('photo'),
  AddCustomer,
);
router.post(
  '/updateCustomer/:id',
  auth(),
  upload.single('photo'),
  UpdateCustomer,
);
router.get('/getUserInfo/:id', auth(), getUserInfo);
router.delete('/deleteCustomer/:id', auth(), deleteCustomer);
router.put('/block-customer', auth(), blockUnblockCustomer);

module.exports = router;
