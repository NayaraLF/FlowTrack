const express = require('express');
const router = express.Router();
const TrainingPlanController = require('../controllers/TrainingPlanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, TrainingPlanController.createOrUpdatePlan);
router.get('/', protect, TrainingPlanController.getPlan);

module.exports = router;
