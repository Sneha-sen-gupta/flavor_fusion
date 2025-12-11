import { useState, useEffect } from 'react';
import { User, Settings, Plus, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';

const ProfilePage = () => {
  const { id } = useParams(); // Get user ID from URL if present
  const [user, setUser] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    avatarUrl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData;
        
        // Determine if we are viewing our own profile or someone else's
        if (id) {
          // Viewing another user
          const response = await api.get(`/auth/${id}`);
          userData = response.data;
          
          // Check if the viewed profile is actually the logged-in user
          const currentUser = JSON.parse(localStorage.getItem('user'));
          setIsOwnProfile(currentUser && currentUser.id === id);
        } else {
          // Viewing own profile (via /profile route)
          const response = await api.get('/auth/me');
          userData = response.data;
          setIsOwnProfile(true);
        }

        setUser(userData);
        setEditForm({
          username: userData.username || '',
          bio: userData.bio || '',
          avatarUrl: userData.avatarUrl || ''
        });

        // Get User's Recipes
        if (userData._id) {
          const recipesRes = await api.get(`/recipes?author=${userData._id}`);
          setMyRecipes(recipesRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', editForm);
      setUser(response.data);
      setIsEditing(false);
      
      // Update local storage if it's the logged-in user
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          username: response.data.username,
          avatarUrl: response.data.avatarUrl
        }));
      }
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${recipeId}`);
        setMyRecipes(myRecipes.filter(r => r._id !== recipeId));
      } catch (err) {
        console.error('Failed to delete recipe', err);
        alert('Failed to delete recipe');
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!user) return <div className="text-center py-20">User not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Profile Header */}
      <div className="bg-brand-dark text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-brand-orange flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span>{user.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {isOwnProfile && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Settings className="text-white" size={24} />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="bg-white/10 p-4 rounded-xl backdrop-blur-md space-y-3">
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Username"
                />
                <input
                  type="text"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Bio (e.g. Pizza Lover)"
                />
                <input
                  type="url"
                  value={editForm.avatarUrl}
                  onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Avatar URL"
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1 rounded-lg bg-brand-orange hover:bg-orange-600 text-sm font-bold"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                <p className="text-gray-300 mb-6">{user.bio || (isOwnProfile ? user.email : 'FlavorFusion Chef')}</p>
                
                {isOwnProfile && (
                  <div className="flex gap-4 justify-center md:justify-start">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors font-medium"
                    >
                      Edit Profile
                    </button>
                    <Link to="/create-recipe" className="px-6 py-2 rounded-full bg-brand-orange hover:bg-orange-600 transition-colors font-bold flex items-center gap-2">
                      <Plus size={18} /> Add Recipe
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">{myRecipes.length}</div>
              <div className="text-gray-400 text-sm">Recipes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-400 text-sm">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('my-recipes')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'my-recipes' ? 'bg-brand-yellow text-brand-dark' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {isOwnProfile ? 'My Recipes' : `${user.username}'s Recipes`}
          </button>
        </div>

        {/* Grid */}
        {activeTab === 'my-recipes' && (
          <div>
            {myRecipes.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No recipes yet</h3>
                {isOwnProfile ? (
                  <>
                    <p className="text-gray-500 mb-6">Share your culinary masterpiece with the world!</p>
                    <Link to="/create-recipe" className="text-brand-orange font-bold hover:underline">
                      Create your first recipe
                    </Link>
                  </>
                ) : (
                  <p className="text-gray-500">This chef hasn't posted any recipes yet.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {myRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe._id} 
                    recipe={recipe} 
                    onDelete={isOwnProfile ? () => handleDeleteRecipe(recipe._id) : null}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
