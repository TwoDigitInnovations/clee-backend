const express = require('express');
const router = express.Router();
const ServicesGroup = require('../controllers/ServicesGroupController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth(), ServicesGroup.createServiceGroup);
router.get('/getAll', auth(), ServicesGroup.getAllServiceGroups);
router.get('/:id', auth(), ServicesGroup.getServiceGroupById);
router.put('/update/:id', auth(), ServicesGroup.updateServiceGroup);
router.delete('/delete/:id', auth(), ServicesGroup.deleteServiceGroup);

module.exports = router;
