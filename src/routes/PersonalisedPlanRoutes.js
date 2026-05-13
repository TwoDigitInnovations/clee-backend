const express = require('express');
const router = express.Router();
const PersonalisedPlanController = require('@controllers/PersonalisedPlanController');
const auth = require('@middlewares/authMiddleware');

router.use(auth('admin'));

router
  .route('/')
  .post(PersonalisedPlanController.createPlan)
  .get(PersonalisedPlanController.getAllPlans);

router
  .route('/:id')
  .get(PersonalisedPlanController.getPlan)
  .put(PersonalisedPlanController.updatePlan)
  .delete(PersonalisedPlanController.deletePlan);

router.patch('/:id/status', PersonalisedPlanController.updateStatus);

module.exports = router;
