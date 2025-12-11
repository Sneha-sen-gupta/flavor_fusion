import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import HeroSection from '../components/HeroSection';
import CategoryChips from '../components/CategoryChips';
import AIFeature from '../components/AIFeature';
import Footer from '../components/Footer';
import { User, Trophy, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, contributorsRes] = await Promise.all([
          api.get('/recipes'),
          api.get('/recipes/top-contributors')
        ]);
        
        const recipesData = recipesRes.data;
        
        const sortedRecipes = recipesData.sort((a, b) => {
          const getAvg = (r) => {
            if (!r.ratings || r.ratings.length === 0) return 0;
            return r.ratings.reduce((acc, curr) => acc + curr.rating, 0) / r.ratings.length;
          };
          return getAvg(b) - getAvg(a);
        });

        setRecipes(sortedRecipes.slice(0, 4));
        setTopContributors(contributorsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleSearch = (query) => {
    navigate(`/explore?search=${query}`);
  };

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      navigate('/explore');
    } else {
      navigate(`/explore?category=${category}`);
    }
  };

  const handleMoodClick = (mood) => {
    navigate(`/explore?mood=${mood}`);
  };

  const moods = ['Comfort', 'Healthy', 'Quick', 'Fancy', 'Sweet'];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section (Search Redirects) */}
      <HeroSection 
        searchQuery={searchQuery} 
        setSearchQuery={(q) => setSearchQuery(q)}
        onSearchSubmit={() => handleSearch(searchQuery)}
      />

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        {/* 2. Filters Row: Categories + Mood Dropdown */}
        <div className="bg-white p-4 rounded-2xl shadow-lg mb-12 border border-gray-100 flex flex-col md:flex-row items-center gap-4 justify-between">
          <CategoryChips 
            selectedCategory={selectedCategory} 
            setSelectedCategory={(cat) => handleCategoryClick(cat)} 
          />
          
          {/* Mood Dropdown */}
          <div className="relative group z-30">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-50 border border-gray-400 hover:border-brand-orange hover:text-brand-orange font-bold text-gray-700 transition-all shadow-sm hover:shadow-md">
              <span>Mood</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block transform transition-all duration-200 origin-top-right">
              <div className="p-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodClick(mood)}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-brand-orange/10 hover:text-brand-orange font-medium transition-colors flex items-center justify-between group/item"
                  >
                    {mood}
                    <span className="opacity-0 group-hover/item:opacity-100 text-brand-orange">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Trending Now (Top 4) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Trending Now</h2>
            <button onClick={() => navigate('/explore')} className="text-brand-orange font-bold hover:underline">
              See All
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>

        {/* 4. AI Feature Block */}
        <div className="mb-20">
          <AIFeature />
        </div>

        {/* 5. Top Contributors */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="text-brand-yellow" size={28} />
              <h2 className="text-2xl font-bold text-brand-dark">Top Contributors</h2>
            </div>
            <button onClick={() => navigate('/chefs')} className="text-brand-orange font-bold hover:underline">
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topContributors.map((contributor) => (
              <Link to={`/profile/${contributor._id}`} key={contributor._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden group-hover:ring-2 ring-brand-orange transition-all">
                  {contributor.avatarUrl ? (
                    <img src={contributor.avatarUrl} alt={contributor.username} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-orange transition-colors">{contributor.username}</h3>
                  <p className="text-brand-orange text-sm font-medium">{contributor.recipeCount} Recipes Shared</p>
                </div>
              </Link>
            ))}
            {topContributors.length === 0 && !loading && (
              <div className="col-span-3 text-center text-gray-500 py-8">
                No contributors yet. Be the first!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
