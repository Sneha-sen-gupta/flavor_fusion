const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a recipe title'],
    },
    description: {
      type: String,
      required: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      default: 'https://cdn.shopify.com/app-store/listing_images/158e4af652886027cc4d8339204f6af9/icon/CJvkpOLsqI0DEAE=.jpeg',
      required: false,
    },
    ingredients: {
      type: [String], 
      required: [true, 'Please add ingredients'],
    },
    steps: {
      type: [String], 
      required: [true, 'Please add steps'],
    },
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert', 'Other'], 
      required: true,
    },
    cookingTime: {
      type: String, 
      required: false,
    },
    calories: {
      type: String,
      required: false,
    },
    mood: {
      type: String,
      required: false,
    },
  
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: Number,
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
