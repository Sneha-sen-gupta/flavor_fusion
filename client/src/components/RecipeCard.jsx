import { Clock, Star, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, onDelete }) => {
  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block">
      {/* Image Container */}
      <Link to={`/recipe/${recipe._id}`} className="h-56 overflow-hidden relative block">
        <img 
          src={recipe.imageUrl || 'https://cdn.shopify.com/app-store/listing_images/158e4af652886027cc4d8339204f6af9/icon/CJvkpOLsqI0DEAE=.jpeg'} 
          alt={recipe.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Delete Button (if onDelete provided) */}
      {onDelete && (
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            onDelete();
          }}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm z-10"
        >
          <Trash size={18} />
        </button>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipe/${recipe._id}`} className="text-xl font-bold text-brand-dark line-clamp-1 group-hover:text-brand-orange transition-colors">
            {recipe.title}
          </Link>
          {recipe.ratings && recipe.ratings.length > 0 ? (
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
              <Star size={16} fill="currentColor" />
              <span>
                {(recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0) / recipe.ratings.length).toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
              <Star size={14} />
              <span>New</span>
            </div>
          )}
        </div>
        
        {recipe.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        )}

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{recipe.calories || 320} kcal</span>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
          <Link to={`/profile/${recipe.author?._id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
              {recipe.author?.avatarUrl ? (
                <img src={recipe.author.avatarUrl} alt={recipe.author.username} className="w-full h-full object-cover" />
              ) : (
                <span>{recipe.author?.username?.charAt(0).toUpperCase() || 'A'}</span>
              )}
            </div>
            <span className="text-xs text-gray-500 hover:text-brand-orange transition-colors">By {recipe.author?.username || 'Unknown Chef'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
