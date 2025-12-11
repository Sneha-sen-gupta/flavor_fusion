import { Link, useNavigate } from 'react-router-dom';
import { Plus, LogOut, User, Heart } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-bold text-brand-dark">FlavorFusion</span>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-brand-dark font-medium hover:text-brand-orange transition-colors">Home</Link>
          <Link to="/explore" className="text-brand-dark font-medium hover:text-brand-orange transition-colors">Explore Recipe</Link>
          <Link to="/ai-chef" className="text-brand-dark font-bold flex items-center gap-1 hover:text-brand-orange transition-colors">
            <span className="text-xl">✨</span> AI Chef
          </Link>
          
        </div>

        {/* Right Side (Auth) */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create-recipe" className="hidden md:flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-brand-orange/20">
                <Plus size={18} />
                <span>Add Recipe</span>
              </Link>
              
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold border border-gray-200">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-brand-gray text-gray-700 font-medium">
                      <User size={16} /> Profile
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-500 font-medium flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-6 py-2 border border-gray-200 rounded-full text-brand-dark font-medium hover:border-brand-orange hover:text-brand-orange transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-brand-dark text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-brand-dark/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
