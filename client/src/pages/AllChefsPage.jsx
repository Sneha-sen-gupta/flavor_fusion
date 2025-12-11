import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, ChevronLeft } from 'lucide-react';
import api from '../api/axios';

const AllChefsPage = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await api.get('/recipes/top-contributors?limit=all');
        setChefs(response.data);
      } catch (err) {
        console.error('Failed to fetch chefs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  if (loading) return <div className="text-center py-20">Loading chefs...</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-brand-dark text-white py-12 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ChevronLeft size={20} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Trophy className="text-brand-yellow" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Our Community Chefs</h1>
          </div>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Meet the talented creators behind FlavorFusion's delicious recipes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {chefs.map((chef) => (
            <Link to={`/profile/${chef._id}`} key={chef._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden mb-4 group-hover:ring-4 ring-brand-orange/20 transition-all">
                {chef.avatarUrl ? (
                  <img src={chef.avatarUrl} alt={chef.username} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} />
                )}
              </div>
              <h3 className="font-bold text-xl text-brand-dark group-hover:text-brand-orange transition-colors mb-1">{chef.username}</h3>
              <div className="bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-sm font-bold">
                {chef.recipeCount} Recipes
              </div>
            </Link>
          ))}
        </div>

        {chefs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No chefs found. Start cooking to appear here!
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChefsPage;
