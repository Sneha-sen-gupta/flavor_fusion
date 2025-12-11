const Recipe = require('../models/Recipe');
const User = require('../models/User');



// @route   GET /api/recipes

const getRecipes = async (req, res) => {
  try {
    const { author, search, category, ingredient, minRating } = req.query;
    let query = {};


    if (author) query.author = author;
    if (search) query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    if (category && category !== 'All') query.category = category;
    if (ingredient) query.ingredients = { $regex: ingredient, $options: 'i' };
    

    const { mood } = req.query;
    if (mood) query.mood = mood;

    // Find recipes in DB and populate author details
    let recipes = await Recipe.find(query).populate('author', 'username avatarUrl');

    if (minRating) {
      const min = Number(minRating);
      recipes = recipes.filter(recipe => {
        if (!recipe.ratings || recipe.ratings.length === 0) return false;
       
        let totalRating = 0;
        for (let i = 0; i < recipe.ratings.length; i++) {
          totalRating = totalRating + recipe.ratings[i].rating;
        }
        const avg = totalRating / recipe.ratings.length;
        
        return avg >= min;
      });
    }

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route   GET /api/recipes/:id

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatarUrl')
      .populate('comments.user', 'username avatarUrl');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route   POST /api/recipes

const createRecipe = async (req, res) => {
  console.log('Creating Recipe Body:', req.body);


  if (!req.body.title || !req.body.ingredients || !req.body.steps) {
    console.log('Missing fields:', { 
      title: !!req.body.title, 
      ingredients: !!req.body.ingredients, 
      steps: !!req.body.steps 
    });
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  try {
    const recipe = await Recipe.create({
      title: req.body.title,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      category: req.body.category,
      cookingTime: req.body.cookingTime,
      imageUrl: req.body.imageUrl || undefined, 
      author: req.user.id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

  
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        imageUrl: req.body.imageUrl || undefined 
      },
      { new: true } 
    );

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await recipe.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    recipe.comments.push(newComment);
    await recipe.save();

    // Return comments with user details
    const populatedRecipe = await Recipe.findById(req.params.id).populate('comments.user', 'username avatarUrl');

    res.status(201).json(populatedRecipe.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

   
    const alreadyRated = recipe.ratings.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (alreadyRated) {
      alreadyRated.rating = Number(rating); 
    } else {
      recipe.ratings.push({
        user: req.user.id,
        rating: Number(rating),
      });
    }

    await recipe.save();
    res.status(200).json(recipe.ratings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTopContributors = async (req, res) => {
  try {
    const recipes = await Recipe.find();

    
    const authorCounts = {};
    recipes.forEach((recipe) => {
      if (recipe.author) {
        const authorId = recipe.author.toString();
        authorCounts[authorId] = (authorCounts[authorId] || 0) + 1;
      }
    });

    
    let sortedAuthorIds = Object.keys(authorCounts)
      .sort((a, b) => {
        
        return authorCounts[b] - authorCounts[a];
      });

    
    const limit = req.query.limit;
    if (limit !== 'all') {
      const limitNum = Number(limit) || 3;
      sortedAuthorIds = sortedAuthorIds.slice(0, limitNum);
    }

    
    const topContributors = [];
    for (const authorId of sortedAuthorIds) {
      const user = await User.findById(authorId);
      if (user) {
        topContributors.push({
          _id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          recipeCount: authorCounts[authorId],
        });
      }
    }

    res.status(200).json(topContributors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
  getTopContributors,
};
