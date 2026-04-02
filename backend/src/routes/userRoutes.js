const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, UserController.updateProfile);

module.exports = router;
