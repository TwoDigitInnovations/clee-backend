const express = require('express');
const router = express.Router();

const controller = require('../controllers/RewardControlller');
const auth = require("@middlewares/authMiddleware");

router.post('/Save', auth('admin'), controller.createOrUpdateReward);
router.get('/getAll', auth('admin'), controller.getAllRewards);
router.get('/:id', auth('admin'), controller.getRewardById);
router.delete('/delete/:id', auth('admin'), controller.deleteReward);

module.exports = router;
