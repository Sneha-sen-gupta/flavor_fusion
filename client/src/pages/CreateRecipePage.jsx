import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import api from '../api/axios';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    cookingTime: '',
    category: 'Dinner',
    mood: '',
    imageUrl: '' 
  });

  const { title, description, ingredients, steps, cookingTime, category, mood, imageUrl } = formData;

  useEffect(() => {
    if (isEditing) {
      const fetchRecipe = async () => {
        try {
          const response = await api.get(`/recipes/${id}`);
          const recipe = response.data;
          setFormData({
            title: recipe.title,
            description: recipe.description || '',
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            cookingTime: recipe.cookingTime,
            category: recipe.category,
            mood: recipe.mood || '',
            imageUrl: recipe.imageUrl || ''
          });
        } catch (err) {
          console.error('Failed to fetch recipe for editing', err);
          setError('Failed to load recipe data');
        }
      };
      fetchRecipe();
    }
  }, [id, isEditing]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...ingredients, ''] });
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...steps, ''] });
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanData = {
        ...formData,
        ingredients: ingredients.filter(i => i.trim() !== ''),
        steps: steps.filter(i => i.trim() !== ''),
        cookingTime: cookingTime
      };

      if (isEditing) {
        await api.put(`/recipes/${id}`, cleanData);
      } else {
        await api.post('/recipes', cleanData);
      }
      
      navigate(isEditing ? `/recipe/${id}` : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-brand-dark" />
        </button>
        <h1 className="text-xl font-bold text-brand-dark">{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Recipe Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                placeholder="e.g., Spicy Miso Ramen"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                placeholder="Briefly describe your dish..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cooking Time (minutes)</label>
                <input
                  type="number"
                  name="cookingTime"
                  value={cookingTime}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                  placeholder="e.g., 45"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={category}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mood (Optional)</label>
              <select
                name="mood"
                value={formData.mood || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
              >
                <option value="">Select a mood...</option>
                <option value="Comfort">Comfort</option>
                <option value="Healthy">Healthy</option>
                <option value="Quick">Quick</option>
                <option value="Fancy">Fancy</option>
                <option value="Sweet">Sweet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={imageUrl}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ingredients</label>
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(index)} className="text-red-400 hover:text-red-600">
                      <Trash size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addIngredient} className="flex items-center gap-2 text-brand-orange font-bold text-sm mt-2">
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <span className="py-3 font-bold text-gray-400">{index + 1}.</span>
                  <textarea
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    rows="2"
                    className="flex-1 px-4 py-3 rounded-lg bg-brand-gray border-none focus:ring-2 focus:ring-brand-orange/20 outline-none"
                    placeholder={`Step ${index + 1}`}
                  />
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(index)} className="text-red-400 hover:text-red-600">
                      <Trash size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addStep} className="flex items-center gap-2 text-brand-orange font-bold text-sm mt-2">
                <Plus size={16} /> Add Step
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-full shadow-lg transform transition hover:-translate-y-1 duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipePage;
