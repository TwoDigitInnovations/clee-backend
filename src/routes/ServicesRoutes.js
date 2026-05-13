const express = require('express');
const router = express.Router();
const Services = require('../controllers/ServicesController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth('admin'), Services.createService);
router.get('/getAll', auth('admin'), Services.getAllServices);
router.get('/:id', auth('admin'), Services.getServiceById);
router.put('/update/:id', auth('admin'), Services.updateService);
router.delete('/delete/:id', auth('admin'), Services.deleteService);

module.exports = router;
