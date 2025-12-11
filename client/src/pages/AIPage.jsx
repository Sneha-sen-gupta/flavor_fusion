import { useState } from 'react';
import { Sparkles, ChefHat, ArrowRight, Save, Loader } from 'lucide-react';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';

const AIPage = () => {
  const [ingredients, setIngredients] = useState('');
  const [mood, setMood] = useState('');
  const [mode, setMode] = useState('leftover'); 
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [error, setError] = useState('');

  const moods = ['Comfort', 'Healthy', 'Quick', 'Fancy', 'Sweet'];

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setError('');
    setGeneratedRecipe(null);

    try {

      const ingredientsList = ingredients.split(',').map(i => i.trim()).filter(i => i);
      
      const response = await api.post('/ai/suggest', { 
        ingredients: ingredientsList,
        mood: mood,
        mode: mode
      });
      setGeneratedRecipe(response.data);
    } catch (err) {
      console.error('AI Generation failed', err);
      setError('The AI chef is a bit overwhelmed right now. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedRecipe) return;
    try {
      await api.post('/recipes', generatedRecipe);
      alert('Recipe saved to your collection!');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save recipe. Make sure you are logged in!');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="bg-brand-dark text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-orange p-4 rounded-full shadow-lg animate-bounce">
              <ChefHat size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Chef Assistant</h1>
          <p className="text-gray-300 text-lg mb-8">
            Tell us what's in your fridge, and we'll conjure up a delicious recipe just for you.
          </p>
          
          {/* Input Area */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col gap-4 max-w-xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={mode === 'leftover' ? "Enter ingredients you have (e.g. eggs, rice, onion)..." : "Enter a dish idea or craving (e.g. spicy pasta)..."}
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 outline-none text-lg bg-gray-50 focus:bg-white transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            {/* Mode Selector */}
            <div className="flex justify-center gap-4 mb-2">
              <button
                onClick={() => setMode('leftover')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  mode === 'leftover'
                    ? 'bg-brand-orange text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                🔥 Leftover Mode
              </button>
              <button
                onClick={() => setMode('creative')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  mode === 'creative'
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                🌈 Creative Mode
              </button>
            </div>

            {/* Mood Selector (Only for Creative Mode) */}
            {mode === 'creative' && (
              <div className="flex flex-wrap gap-2 px-2 pb-2 justify-center">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-wider self-center mr-2">Mood:</span>
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(mood === m ? '' : m)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      mood === m
                        ? 'bg-purple-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading || !ingredients.trim()}
              className="w-full bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} className="text-brand-orange" />
                  Generate Recipe
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin mb-4 text-brand-orange">
              <Loader size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Thinking up something tasty...</h3>
            <p className="text-gray-500">Analyzing flavor combinations</p>
          </div>
        )}

        {generatedRecipe && !loading && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark">Here's your custom recipe:</h2>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 text-brand-orange font-bold hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors"
              >
                <Save size={20} />
                Save to Collection
              </button>
            </div>

            {/* We can reuse the RecipeCard for a preview, or build a custom view */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={generatedRecipe.imageUrl || generatedRecipe.image || 'https://cdn.shopify.com/app-store/listing_images/158e4af652886027cc4d8339204f6af9/icon/CJvkpOLsqI0DEAE=.jpeg'} 
                  alt={generatedRecipe.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {generatedRecipe.mood && (
                    <div className="bg-brand-dark text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {generatedRecipe.mood}
                    </div>
                  )}
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    AI Generated
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold text-brand-dark mb-2">{generatedRecipe.title}</h3>
                <p className="text-gray-500 mb-6">{generatedRecipe.description || 'A unique creation based on your ingredients.'}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-brand-orange rounded-full"></span> Ingredients
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      {generatedRecipe.ingredients.map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-brand-orange rounded-full"></span> Instructions
                    </h4>
                    <ol className="space-y-2 text-gray-600">
                      {(generatedRecipe.steps || generatedRecipe.instructions).map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold text-brand-orange">{i+1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPage;
