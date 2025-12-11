import { Search, ChefHat } from 'lucide-react';

const HeroSection = ({ searchQuery, setSearchQuery, onSearchSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="relative h-[500px] w-full bg-brand-dark overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Cooking Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">

        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl animate-fade-in-up delay-100">
          Discover the <span className="text-brand-orange">Joy</span> of <br/> 
          Home Cooking
        </h1>
        
        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl animate-fade-in-up delay-200">
          Join thousands of food lovers sharing their favorite recipes, tips, and culinary adventures.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative animate-fade-in-up delay-300">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={24} />
          </div>
          <input 
            type="text" 
            placeholder="What do you want to cook today?" 
            className="w-full py-4 pl-14 pr-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white/20 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={onSearchSubmit}
            className="absolute right-2 top-2 bottom-2 bg-brand-orange hover:bg-orange-600 text-white px-6 rounded-full font-bold transition-colors flex items-center gap-2"
          >
            <ChefHat size={20} />
            <span className="hidden sm:inline">Find Recipe</span>
          </button>
        </div>

        {/* Stats */}

      </div>
    </div>
  );
};

export default HeroSection;
