const express = require('express');
const router = express.Router();
const Services = require('../controllers/ServicesController');
const auth = require('@middlewares/authMiddleware');

router.post('/create', auth(), Services.createService);
router.get('/getAll', auth(), Services.getAllServices);
router.get('/:id', auth(), Services.getServiceById);
router.put('/update/:id', auth(), Services.updateService);
router.delete('/delete/:id', auth(), Services.deleteService);

module.exports = router;
