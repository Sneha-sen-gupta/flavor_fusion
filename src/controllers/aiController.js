const axios = require('axios');


// @route   POST /api/ai/suggest

const suggestRecipe = async (req, res) => {
  const { ingredients, mood, mode } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: 'Please provide ingredients or a prompt' });
  }


  let modeInstruction = '';
  if (mode === 'leftover') {
    modeInstruction = `
      Mode A — Leftover Cooking (Strict Mode)
      User provides ingredients: ${ingredients.join(', ')}.
      Your job is to generate a recipe using **only those ingredients**, plus basic pantry items.
      Set "usesLeftoverOnly": true.
    `;
  } else {
    modeInstruction = `
      Mode B — AI Creative Recipe Generator (Flexible Mode)
      User input: ${ingredients.join(', ')}.
      User mood: ${mood || 'Any'}.
      Creativity > restriction.
      Set "usesLeftoverOnly": false.
    `;
  }

  const prompt = `
    **You are an AI chef for a cooking app.**
    ${modeInstruction}

    ### Output Rules
    Return ONLY a valid JSON object with this exact structure:
    {
      "title": "Recipe Name",
      "description": "Short description",
      "ingredients": ["List of ingredients"],
      "steps": ["Step 1", "Step 2"],
      "category": "Dinner", 
      "cookingTime": "30 minutes",
      "calories": "500 kcal",
      "mood": "Comfort",
      "usesLeftoverOnly": true,
      "imageUrl": ""
    }
    IMPORTANT: "category" options: "Breakfast", "Lunch", "Dinner", "Snacks", "Dessert", "Other".
    IMPORTANT: "mood" options: "Comfort", "Healthy", "Quick", "Fancy", "Sweet".
    Do not add markdown formatting. Just JSON.
  `;


  const models = [
    'gemini-flash-latest',       
    'gemini-1.5-flash',       
    'gemini-pro',              
    'gemini-1.5-pro-latest'      
  ];

  const apiKey = process.env.GEMINI_API_KEY;
  let lastError = null;


  for (const modelName of models) {
    try {
      console.log(`🤖 AI Chef attempting with model: ${modelName}...`);
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from AI');


      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const recipe = JSON.parse(jsonStr);


      if (!recipe.imageUrl || recipe.imageUrl.trim() === '') {
        recipe.imageUrl = 'https://cdn.shopify.com/app-store/listing_images/158e4af652886027cc4d8339204f6af9/icon/CJvkpOLsqI0DEAE=.jpeg';
      }

 
      console.log(`✅ Success with ${modelName}`);
      return res.status(200).json(recipe);

    } catch (error) {
      console.log(`❌ Model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }


  console.error('All AI models failed.');
  res.status(503).json({ 
    message: 'The AI Chef is busy finding the right cookbook. Please try again!', 
    error: lastError ? lastError.message : 'Unknown error' 
  });
};

module.exports = { suggestRecipe };
