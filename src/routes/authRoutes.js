const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  toggleSavedRecipe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register -> Register a new user
router.post('/register', registerUser);

// POST /api/auth/login -> Login user
router.post('/login', loginUser);

// GET /api/auth/me -> Get current user info (Protected)
router.get('/me', protect, getMe);

// PUT /api/auth/save/:id -> Save/Unsave a recipe (Protected)
router.put('/save/:id', protect, toggleSavedRecipe);

// PUT /api/auth/profile -> Update user profile (Protected)
const { updateProfile } = require('../controllers/authController');
router.put('/profile', protect, updateProfile);

// GET /api/auth/:id -> Get public user profile
const { getUserById } = require('../controllers/authController');
router.get('/:id', getUserById);

module.exports = router;
