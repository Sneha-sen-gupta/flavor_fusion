const express = require('express');
const router = express.Router();
const { suggestRecipe } = require('../controllers/aiController');

const { protect } = require('../middleware/authMiddleware');

router.post('/suggest', protect, suggestRecipe);

module.exports = router;
