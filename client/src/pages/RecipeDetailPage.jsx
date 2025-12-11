import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Flame, ChevronLeft, Star, Share2, Pencil } from 'lucide-react';
// ... existing imports ...


import api from '../api/axios';
import IngredientList from '../components/IngredientList';
import CommentsSection from '../components/CommentsSection';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      setRecipe(response.data);
    } catch (err) {
      console.error('Failed to fetch recipe', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Recipe link copied to clipboard!');
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!recipe) return <div className="text-center py-20">Recipe not found</div>;

  // Calculate average rating
  let avgRating = 'New';
  if (recipe.ratings && recipe.ratings.length > 0) {
    let total = 0;
    for (let i = 0; i < recipe.ratings.length; i++) {
      total += recipe.ratings[i].rating;
    }
    avgRating = (total / recipe.ratings.length).toFixed(1);
  }

  const user = JSON.parse(localStorage.getItem('user'));
  
  // Check for both .id and ._id just in case
  const userId = user?.id || user?._id;
  const authorId = recipe?.author?._id || recipe?.author;
  
  const isOwner = userId && authorId && userId.toString() === authorId.toString();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img 
          src={recipe.imageUrl || '/default-recipe.jpg'} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <Link to="/" className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex gap-2">
            {isOwner && (
              <Link 
                to={`/edit-recipe/${recipe._id}`}
                className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <Pencil size={24} />
              </Link>
            )}
            <button 
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-4">
              <span className="bg-brand-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                {recipe.category}
              </span>
              {recipe.mood && (
                <span className="bg-brand-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  {recipe.mood}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-lg text-gray-200 mb-6 max-w-2xl">{recipe.description}</p>
            )}
            
            <div className="flex items-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-brand-yellow" />
                <span>{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-brand-yellow" />
                <span>{recipe.calories || 320} kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-brand-yellow fill-brand-yellow" />
                <span>{avgRating} ({recipe.ratings?.length || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        {/* Left Column: Ingredients & Steps */}
        <div className="md:col-span-2 space-y-12">
          
          {/* Ingredients Component */}
          <IngredientList ingredients={recipe.ingredients} />

          {/* Steps */}
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Instructions</h2>
            <div className="space-y-8">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Component */}
          <CommentsSection 
            recipeId={recipe._id} 
            comments={recipe.comments} 
            ratings={recipe.ratings} 
            onUpdate={fetchRecipe} 
          />
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-bold text-brand-dark mb-4">Chef's Note</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This recipe is perfect. Feel free to substitute ingredients based on what you have in your fridge!
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
