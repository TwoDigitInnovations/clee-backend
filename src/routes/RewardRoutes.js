const express = require('express');
const router = express.Router();

const controller = require('../controllers/RewardControlller');
const auth = require("@middlewares/authMiddleware");

router.post('/Save', auth(), controller.createOrUpdateReward);
router.get('/getAll', auth(), controller.getAllRewards);
router.get('/:id', auth(), controller.getRewardById);
router.delete('/delete/:id', auth(), controller.deleteReward);

module.exports = router;
