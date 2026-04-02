const express = require('express');
const router = express.Router();
const WorkoutController = require('../controllers/WorkoutController');

router.post('/', WorkoutController.createWorkout);
router.get('/', WorkoutController.getAllWorkouts);
router.get('/:id', WorkoutController.getWorkoutById);

module.exports = router;
