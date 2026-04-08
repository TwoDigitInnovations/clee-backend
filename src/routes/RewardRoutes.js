const express = require('express');
const router = express.Router();

const controller = require('../controllers/RewardControlller');
const auth = require("@middlewares/authMiddleware");

router.post('/create', auth('admin'), controller.createReward);
router.get('/getAll', auth('admin'), controller.getAllRewards);
router.get('/:id', auth('admin'), controller.getRewardById);
router.put('/update/:id', auth('admin'), controller.updateReward);
router.delete('/delete/:id', auth('admin'), controller.deleteReward);

module.exports = router;
