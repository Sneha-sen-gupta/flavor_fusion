const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Healthy', 'Quick', 'Vegan'];

const CategoryChips = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
      <div className="flex gap-3 px-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 transform scale-105'
                : 
                'bg-white text-gray-600 border border-gray-100 hover:border-brand-orange/50 hover:text-brand-orange'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;
