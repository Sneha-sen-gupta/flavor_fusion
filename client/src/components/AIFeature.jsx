import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIFeature = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-gray-900 p-8 md:p-12 text-white shadow-2xl">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-brand-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-brand-yellow text-sm font-bold mb-6 border border-white/10">
            <Sparkles size={16} />
            <span>AI-Powered Chef</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            No exact match? <br/>
            Let AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow">invent a recipe</span> for you.
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Tell us what ingredients you have, and our AI will generate a unique, delicious recipe in seconds.
          </p>
          <Link 
            to="/ai-chef" 
            className="inline-flex items-center gap-2 bg-white text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-brand-orange hover:text-white transition-all shadow-lg group"
          >
            Try AI Generator
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Visual Element (Mock UI Card) */}
        <div className="hidden md:block relative">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-72 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex gap-3 mb-4">
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">Avocado</span>
              <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs">Tomato</span>
              <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs">Egg</span>
            </div>
            <div className="h-2 w-3/4 bg-white/20 rounded mb-2"></div>
            <div className="h-2 w-1/2 bg-white/20 rounded mb-4"></div>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <span className="text-sm font-medium">Generating...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeature;
