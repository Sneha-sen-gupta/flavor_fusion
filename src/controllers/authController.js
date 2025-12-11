const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};


// @route   POST /api/auth/register

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }


  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};


// @route   POST /api/auth/login

const loginUser = async (req, res) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });


  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};


// @route   GET /api/auth/me

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedRecipes');
  res.status(200).json(user);
};


// @route   PUT /api/auth/save/:id

const toggleSavedRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.id;

 
    if (user.savedRecipes.includes(recipeId)) {
    
      user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
      await user.save();
      return res.status(200).json({ message: 'Recipe removed from saved list', savedRecipes: user.savedRecipes });
    } else {
      user.savedRecipes.push(recipeId);
      await user.save();
      return res.status(200).json({ message: 'Recipe saved', savedRecipes: user.savedRecipes });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route   GET /api/auth/:id

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email'); // Exclude sensitive info
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route   PUT /api/auth/profile

const updateProfile = async (req, res) => {
  try {
    console.log('Update Profile Request:', {
      userId: req.user._id,
      body: req.body
    });

    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.bio = req.body.bio || user.bio;
      user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        bio: updatedUser.bio,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  toggleSavedRecipe,
  getUserById,
  updateProfile,
};
