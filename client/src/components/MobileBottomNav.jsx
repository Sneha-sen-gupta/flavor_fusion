import { Home, Search, PlusSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 py-3 px-6 flex justify-between items-center z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-brand-orange' : 'text-gray-400'}`}>
        <Home size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-brand-orange' : 'text-gray-400'}`}>
        <Search size={24} />
        <span className="text-[10px] font-medium">Search</span>
      </Link>

      <Link to="/create-recipe" className="flex flex-col items-center gap-1 -mt-8">
        <div className="bg-brand-orange text-white p-3 rounded-full shadow-lg border-4 border-white">
          <PlusSquare size={24} />
        </div>
      </Link>

      <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-brand-orange' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
