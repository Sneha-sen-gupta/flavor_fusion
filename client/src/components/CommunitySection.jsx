import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CommunitySection = () => {
  const [topChefs, setTopChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const response = await api.get('/recipes/top-contributors');
        setTopChefs(response.data);
      } catch (error) {
        console.error('Failed to fetch top contributors', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopContributors();
  }, []);

  if (loading) return null; 

  return (
    <div className="py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Top Chefs of the Week</h2>
          <p className="text-gray-500">Check out who's cooking up a storm.</p>
        </div>
      
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {topChefs.map((chef, index) => (
          <Link to={`/profile/${chef._id}`} key={chef._id} className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-brand-orange transition-all shadow-md bg-gray-200 flex items-center justify-center">
              {chef.avatarUrl ? (
                <img src={chef.avatarUrl} alt={chef.username} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            <h3 className="font-bold text-brand-dark">{chef.username}</h3>
            <span className="text-xs text-brand-orange font-medium bg-orange-50 px-2 py-1 rounded-full mt-1">
              {chef.recipeCount} Recipes
            </span>
          </Link>
        ))}
        
        {topChefs.length === 0 && (
          <div className="col-span-full text-center text-gray-500 italic">
            No top chefs yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySection;
