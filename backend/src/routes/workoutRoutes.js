const express = require('express');
const router = express.Router();
const WorkoutController = require('../controllers/WorkoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, WorkoutController.createWorkout);
router.get('/', protect, WorkoutController.getAllWorkouts);
router.get('/:id', protect, WorkoutController.getWorkoutById);

module.exports = router;
