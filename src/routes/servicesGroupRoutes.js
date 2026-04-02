const express = require('express');
const router = express.Router();
const ServicesGroup = require('../controllers/ServicesGroupController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth('admin'), ServicesGroup.createServiceGroup);
router.get('/getAll', auth('admin'), ServicesGroup.getAllServiceGroups);
router.get('/:id', auth('admin'), ServicesGroup.getServiceGroupById);
router.put('/update/:id', auth('admin'), ServicesGroup.updateServiceGroup);
router.delete('/delete/:id', auth('admin'), ServicesGroup.deleteServiceGroup);

module.exports = router;
