
const express = require('express');
const router = express.Router();


const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
  getTopContributors,
} = require('../controllers/recipeController');


const { protect } = require('../middleware/authMiddleware');


// GET /api/recipes -> getRecipes
// POST /api/recipes -> createRecipe (Protected)
router.route('/').get(getRecipes).post(protect, createRecipe);

// GET /api/recipes/top-contributors -> getTopContributors
router.get('/top-contributors', getTopContributors);

// GET /api/recipes/:id -> getRecipeById
// PUT /api/recipes/:id -> updateRecipe (Protected)
// DELETE /api/recipes/:id -> deleteRecipe (Protected)
router.route('/:id').get(getRecipeById).put(protect, updateRecipe).delete(protect, deleteRecipe);

// POST /api/recipes/:id/comments -> addComment (Protected)
router.route('/:id/comments').post(protect, addComment);

// POST /api/recipes/:id/rating -> addRating (Protected)
router.route('/:id/rating').post(protect, addRating);

module.exports = router;