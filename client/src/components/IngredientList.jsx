import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const IngredientList = ({ ingredients }) => {
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Ingredients</h2>
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <li 
            key={index} 
            onClick={() => toggleIngredient(index)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border ${
              checkedIngredients[index] 
                ? 'bg-brand-orange/10 border-brand-orange/20' 
                : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
            }`}
          >
            {checkedIngredients[index] ? (
              <CheckCircle size={20} className="text-brand-orange flex-shrink-0" />
            ) : (
              <Circle size={20} className="text-gray-300 flex-shrink-0" />
            )}
            <span className={`${checkedIngredients[index] ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
              {ingredient}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
