import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import { Search, Filter, X } from 'lucide-react';

const AllRecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const mood = searchParams.get('mood') || '';
  const minRating = searchParams.get('minRating') || '';

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Healthy', 'Quick', 'Vegan'];
  const moods = ['Comfort', 'Healthy', 'Quick', 'Fancy', 'Sweet'];

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
   
        const params = new URLSearchParams(searchParams);
        
    
        if (params.get('category') === 'All') {
          params.delete('category');
        }

        const queryString = params.toString();
        const response = await api.get(`/recipes?${queryString}`);
        setRecipes(response.data);
      } catch (err) {
        console.error('Failed to fetch recipes', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch to avoid too many requests while typing/clicking
    const timeoutId = setTimeout(() => {
      fetchRecipes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Toggle logic: if the value is already selected, remove it (for mood/rating)
    const currentValue = newParams.get(key);
    if (currentValue === value && key !== 'search') {
      newParams.delete(key);
    } else if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    // Reset pagination or other states if needed (not applicable here yet)
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6 text-brand-dark font-bold">
                <div className="flex items-center gap-2">
                  <Filter size={20} />
                  <h2>Filters</h2>
                </div>
                {(category !== 'All' || mood || minRating || search) && (
                  <button 
                    onClick={() => setSearchParams({})}
                    className="text-xs text-brand-orange hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => updateFilters('search', e.target.value)}
                    placeholder="Ingredients, title..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
                  />
                  {search && (
                    <button 
                      onClick={() => updateFilters('search', '')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-brand-orange transition-colors">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={category === cat}
                        onChange={() => updateFilters('category', cat)}
                        className="text-brand-orange focus:ring-brand-orange"
                      />
                      <span className={category === cat ? 'font-bold text-brand-dark' : 'text-gray-600'}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Moods */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(m => (
                    <button
                      key={m}
                      onClick={() => updateFilters('mood', m)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        mood === m 
                          ? 'bg-brand-dark text-white border-brand-dark' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Rating</label>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button 
                      key={rating} 
                      onClick={() => updateFilters('minRating', String(rating))}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                        minRating === String(rating) ? 'bg-orange-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex items-center ${minRating === String(rating) ? 'text-brand-orange' : 'text-brand-yellow'}`}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating ? 'fill-current' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <span className={`text-sm ${minRating === String(rating) ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>
                        & Up
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-brand-dark">
                {search ? `Results for "${search}"` : 'All Recipes'}
              </h1>
              <span className="text-gray-500">{recipes.length} results</span>
            </div>

            {loading ? (
              <div className="text-center py-20">Loading recipes...</div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-700 mb-2">No recipes found</h3>
                <p className="text-gray-500 mb-6">Try clearing your filters or search for something else.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="px-6 py-2 bg-brand-orange text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRecipesPage;
